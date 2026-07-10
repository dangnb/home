const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Creating default data if empty...");

    // 1. Gallery Items
    const galleryUrls = [
        "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    ];
    
    const currentGallery = await prisma.galleryItem.count();
    if (currentGallery === 0) {
        for (let i = 0; i < galleryUrls.length; i++) {
            await prisma.galleryItem.create({
                data: {
                    title: `Gallery Image ${i + 1}`,
                    image: galleryUrls[i],
                    order: i
                }
            });
        }
        console.log("Created gallery items.");
    }

    // 2. Team Members
    const teamUrls = [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
    ];
    
    const currentTeam = await prisma.teamMember.count();
    if (currentTeam === 0) {
        for (let i = 0; i < teamUrls.length; i++) {
            await prisma.teamMember.create({
                data: {
                    name: `Stylist ${i + 1}`,
                    role: "Senior Technician",
                    image: teamUrls[i],
                    order: i
                }
            });
        }
        console.log("Created team members.");
    }

    // 3. Services
    const serviceUrls = [
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516975080661-4606f7fb13d6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595856417531-158000490b4d?q=80&w=800&auto=format&fit=crop"
    ];
    const currentServices = await prisma.service.count();
    if (currentServices === 0) {
        // Need a category first
        let cat = await prisma.category.findFirst();
        if (!cat) {
            cat = await prisma.category.create({
                data: { label: "Nails", slug: "nails" }
            });
        }
        
        for (let i = 0; i < serviceUrls.length; i++) {
            await prisma.service.create({
                data: {
                    slug: `service-${i + 1}`,
                    name: `Service ${i + 1}`,
                    categoryId: cat.id,
                    price: "100",
                    image: serviceUrls[i],
                    order: i
                }
            });
        }
        console.log("Created services.");
    }

    console.log("Done checking/creating default items!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
