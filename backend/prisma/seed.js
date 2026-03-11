const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const patientPassword = await bcrypt.hash('patient123', 10);

    // Admin
    await prisma.user.upsert({
        where: { email: 'admin@mediresolve.com' },
        update: {},
        create: {
            name: 'System Administrator',
            email: 'admin@mediresolve.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Patient
    const patient = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            name: 'John Doe',
            email: 'john@example.com',
            password: patientPassword,
            role: 'PATIENT',
        },
    });

    // Sample Complaint
    await prisma.complaint.create({
        data: {
            patientId: patient.id,
            patientIdentifier: 'HOSP-9908',
            department: 'Cardiology',
            category: 'Long waiting time',
            description: 'I waited for over 3 hours for my heart checkup despite having a confirmed appointment.',
            priority: 'HIGH',
            status: 'SUBMITTED',
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
