import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

function replaceInFiles(dir: string, map: Record<string, string>, extensions: string[]) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInFiles(filePath, map, extensions);
    } else {
      if (extensions.some(ext => filePath.endsWith(ext))) {
        let content = fs.readFileSync(filePath, "utf-8");
        let modified = false;
        
        for (const [oldUrl, newUrl] of Object.entries(map)) {
          // oldUrl might be "/images/banner.webp"
          // We should escape regex characters, though they are mostly just dots and slashes
          const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
          if (regex.test(content)) {
            content = content.replace(regex, newUrl);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content, "utf-8");
          console.log(`Updated file: ${filePath}`);
        }
      }
    }
  }
}

async function main() {
  const mapPath = path.join(process.cwd(), "migration_map.json");
  if (!fs.existsSync(mapPath)) {
    console.error("No migration_map.json found.");
    return;
  }

  const map = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  console.log(`Loaded ${Object.keys(map).length} mapping entries.`);

  // 1. Replace in codebase (src directory)
  const srcDir = path.join(process.cwd(), "src");
  console.log("Replacing in src/ directory...");
  replaceInFiles(srcDir, map, [".ts", ".tsx", ".css"]);

  // 2. Replace in data JSON files
  const dataDir = path.join(process.cwd(), "data");
  console.log("Replacing in data/ directory...");
  replaceInFiles(dataDir, map, [".json"]);

  // 3. Update Database using Prisma
  console.log("Updating Database...");
  const prisma = new PrismaClient();
  
  // Settings
  const settings = await prisma.setting.findMany();
  for (const setting of settings) {
    let newVal = setting.value;
    for (const [oldUrl, newUrl] of Object.entries(map)) {
      newVal = newVal.split(oldUrl).join(newUrl);
    }
    if (newVal !== setting.value) {
      await prisma.setting.update({ where: { key: setting.key }, data: { value: newVal } });
      console.log(`Updated setting: ${setting.key}`);
    }
  }

  // Posts
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    let updated = false;
    let newThumb = post.thumbnail;
    let newContent = post.content;
    
    for (const [oldUrl, newUrl] of Object.entries(map)) {
      if (newThumb?.includes(oldUrl)) { newThumb = newThumb.split(oldUrl).join(newUrl); updated = true; }
      if (newContent?.includes(oldUrl)) { newContent = newContent.split(oldUrl).join(newUrl); updated = true; }
    }
    
    if (updated) {
      await prisma.post.update({ where: { id: post.id }, data: { thumbnail: newThumb, content: newContent } });
      console.log(`Updated post: ${post.slug}`);
    }
  }

  // Cruises
  const cruises = await prisma.cruise.findMany();
  for (const cruise of cruises) {
    let updated = false;
    let newMain = cruise.mainImage;
    let newGallery = cruise.gallery;
    let newDesc = cruise.description;
    
    for (const [oldUrl, newUrl] of Object.entries(map)) {
      if (newMain?.includes(oldUrl)) { newMain = newMain.split(oldUrl).join(newUrl); updated = true; }
      if (newGallery?.includes(oldUrl)) { newGallery = newGallery.split(oldUrl).join(newUrl); updated = true; }
      if (newDesc?.includes(oldUrl)) { newDesc = newDesc.split(oldUrl).join(newUrl); updated = true; }
    }
    
    if (updated) {
      await prisma.cruise.update({ where: { id: cruise.id }, data: { mainImage: newMain, gallery: newGallery, description: newDesc } });
      console.log(`Updated cruise: ${cruise.slug}`);
    }
  }

  await prisma.$disconnect();
  console.log("Database update complete.");
}

main().catch(e => console.error(e));
