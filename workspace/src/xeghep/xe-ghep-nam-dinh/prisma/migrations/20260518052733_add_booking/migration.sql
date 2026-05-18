-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropAddress" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "tripDate" TEXT NOT NULL,
    "tripTime" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "vehicleType" TEXT NOT NULL DEFAULT 'xe-ghep',
    "note" TEXT,
    "price" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_code_key" ON "Booking"("code");
