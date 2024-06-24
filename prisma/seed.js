import { PrismaClient } from '@prisma/client';

// Instancie o Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    // Criar produtos de exemplo
    const produtos = await prisma.product.createMany({
      data: [
        {
          name: 'Conjunto Floral',
          description: 'Um conjunto floral elegante.',
          price: 89.99,
          categoryId: 1, // ID da categoria "Conjunto"
        },
        {
          name: 'Calcinha Renda',
          description: 'Calcinha de renda confortável.',
          price: 19.99,
          categoryId: 2, // ID da categoria "Calcinha"
        },
        {
          name: 'Biquini Azul Marinho',
          description: 'Um biquíni azul marinho básico.',
          price: 39.99,
          categoryId: 3, // ID da categoria "Biquini"
        },
        {
          name: 'Sutiã Preto',
          description: 'Um sutiã preto clássico.',
          price: 29.99,
          categoryId: 4, // ID da categoria "Sutia"
        },
      ],
    });

    console.log('Produtos criados:', produtos);
  } catch (error) {
    console.error('Erro ao criar produtos:', error);
  } finally {
    // Fechar conexão com o Prisma Client
    await prisma.$disconnect();
  }
}

// Chamar a função main para criar os produtos
main();