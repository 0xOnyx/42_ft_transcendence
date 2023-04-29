// https://www.prisma.io/docs/guides/migrate/seed-database
// https://fakerjs.dev/
// to execute this script, run : `npx prisma db seed`
//

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

console.log('init prisma...');
const prisma  = new PrismaClient();


async function main() 
{
    const fakerRounds = 10;
    console.log('init dotenv...');
    dotenv.config();
    console.log('create fakerUser...');


    const Users: Array<any> = await prisma.user.findMany({
        orderBy: [
            {oauth_42_id: 'desc'},
        ],
        select: {
          oauth_42_id: true
        },
        take: 1,
    })
    
    let init_id = 100;
    if(Users.length) {
        init_id = Users[0].oauth_42_id + 1;
    }
    
    const fakerUser = (): any => ({
        name: faker.name.firstName() + faker.name.lastName(),
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        image_url: faker.image.imageUrl(),
        oauth_42_login: faker.word.adjective(),
        oauth_42_id: init_id,
        last_login: faker.date.between('2020-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'),
        online_status: 'OFFLINE'
    });

    console.log('Seeding...');
    /// --------- Users ---------------
    for (let i = 0; i < fakerRounds; i++) {
        let d: any = fakerUser();
        d.oauth_42_id = d.oauth_42_id + i;
        await prisma.user.create({ data: d });
    }
  
};
  

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });