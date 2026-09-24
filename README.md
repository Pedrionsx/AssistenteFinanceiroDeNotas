# 📸 Gasto na Foto

O **Gasto na Foto** é uma aplicação web inteligente que utiliza Inteligência Artificial para automatizar a leitura e o registro de comprovantes fiscais. Basta o usuário enviar a foto de um cupom fiscal, e a IA extrai automaticamente os dados da compra, organizando-os em uma interface limpa, moderna e interativa.

## 🎯 O problema que este projeto soluciona

Fazer o controle financeiro pessoal ou empresarial muitas vezes esbarra em uma tarefa monótona e sujeita a erros: **a digitação manual de recibos e cupons fiscais**. 
Guardar papéis, ler item por item e digitar em planilhas consome tempo e energia. O *Gasto na Foto* elimina essa fricção, permitindo que a extração de dados complexos (nome da empresa, lista de produtos, quantidades, preços unitários e valor total) seja feita em segundos, apenas com uma imagem.

## ✨ Funcionalidades

- **Leitura Inteligente (Powered by AI):** Upload de imagens de cupons fiscais com análise instantânea via API de IA (`puter.js`).
- **Validação de Imagem:** O sistema identifica se a foto enviada é realmente um comprovante e notifica o usuário em caso de erro, usando *Flash Notifications* personalizadas.
- **Extração Detalhada:** Identifica e exibe o nome do estabelecimento, os produtos comprados (com suas respectivas quantidades e preços unitários) e o valor total exato pago.
- **Cálculo Automático:** Soma em tempo real o valor de múltiplos comprovantes lidos, mantendo um painel atualizado com o "Total Gasto" geral.
- **Interface Dinâmica e Animada:**
  - **Sanfona Vertical (Accordion):** Se a compra tiver muitos itens, a interface oculta os produtos extras por padrão para manter a tela limpa. Ao clicar em "Mostrar Mais", uma animação suave (usando CSS Grid) revela o restante da lista.
  - **Exclusão de Comprovantes:** É possível deletar um comprovante específico da lista clicando no ícone de lixeira. O valor total geral da tela é recalculado e atualizado automaticamente.

## 🚀 Vantagens de Uso

- **Rapidez:** Transforma uma tarefa manual demorada em um processo de poucos cliques.
- **Precisão:** A IA é instruída a ler exatamente os valores impressos, evitando arredondamentos ou confusões com taxas e trocos.
- **Fácil Acessibilidade:** Funciona diretamente no navegador, sem necessidade de instalar aplicativos pesados, com layout responsivo e amigável.
- **Feedback Visual:** Animações fluidas e notificações claras garantem que o usuário sempre entenda o que está acontecendo na aplicação.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica do projeto.
- **CSS3:** Estilização, Flexbox, CSS Grid (para animações de expansão fluidas) e variáveis de estado.
- **JavaScript (Vanilla):** Lógica de programação, manipulação do DOM e consumo de API.
- **[Puter.js](https://puter.com/):** SDK utilizado para integração rápida com Inteligência Artificial para visão computacional (análise de imagens).
- **Font Awesome:** Biblioteca de ícones (Lixeira).

## ⚙️ Como executar o projeto localmente

Como o projeto utiliza tecnologias Front-end nativas e a API do Puter via CDN, rodar o projeto é extremamente simples:

1. Faça o clone deste repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/gasto-na-foto.git](https://github.com/SEU_USUARIO/gasto-na-foto.git)
