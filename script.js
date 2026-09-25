
const boxComprovantes = document.getElementById('section_comprovantes')
const valorComprovantes = document.getElementById('valor_comprovantes')
const quantidadeComprovante = document.getElementById('quantidade_comprovantes')
const flashedBox = document.getElementById('flashed_box')

let comprovantes_loaded = 0
let valor_total_comprovantes = 0

async function loadPhoto() {
  const foto = document.querySelector('#foto')
  let comprovante = foto.files[0]

  // Notificação visual para o usuário enquanto a IA pensa
  flashedNotification('Analisando comprovante, por favor aguarde...');

  try {
    let resposta = await puter.ai.chat(`
    Analise o comprovante enviado e extraia SOMENTE as informações solicitadas abaixo.

    Informações que devem ser extraídas:

    1. Nome da empresa:
    - Extraia o nome da empresa/estabelecimento.
    - Converta todas as letras para MAIÚSCULAS.
    - Salve no campo "nome_empresa".

    2. Produtos:
    Para cada produto comprado, extraia:
    - "nome": nome do produto exatamente como identificado no comprovante.
    - "preco": preço UNITÁRIO do produto como NÚMERO.
    - "quantidade": quantidade comprada como NÚMERO.

    3. Valor total da compra:
    - Identifique no comprovante o valor correspondente ao TOTAL FINAL da compra/pagamento.
    - Procure campos como "TOTAL", "VALOR TOTAL", "TOTAL A PAGAR", "VALOR PAGO" ou equivalentes.
    - Converta o valor para número JSON usando "." como separador decimal.
    - Salve o resultado no campo "valor_total".

    4. Verifique a imagem enviada e identifique se ela é ou não um comprovante:
    - Se for um comprovante "status": true
    - Se não for um comprovante "status": false

    REGRAS IMPORTANTES:
    - Retorne SOMENTE um JSON válido.
    - NÃO utilize Markdown.
    - Os campos "preco" e "valor_total" DEVEM ser números JSON.
    - NÃO coloque "R$" nos campos numéricos.

    Formato obrigatório da resposta:
    {
        "nome_empresa": "NOME DA EMPRESA",
        "status": true,
        "valor_total": 1250.90,
        "produtos": [
            { "nome": "Nome do produto", "preco": 85.00, "quantidade": 2 }
        ]
    }`, comprovante)

    console.log(resposta.message.content)
    let dados = JSON.parse(resposta.message.content)

    if (dados.status) {
      novoComprovante(dados)
    } else {
      flashedNotification('A imagem enviada não foi reconhecida como um comprovante')
    }
  } catch (error) {
    console.error("Erro ao analisar imagem: ", error)
    flashedNotification('Ocorreu um erro ao processar a imagem. Tente novamente.');
  }
}

async function novoComprovante(dados) {
  const comprovante = document.createElement('div')
  comprovante.className = 'caixa-comprovantes'
  comprovante.id = `caixa_comprovantes_${comprovantes_loaded}`
  comprovante.dataset.valorTotal = dados.valor_total

  const temVariosProdutos = dados.produtos.length > 1
  const primeiroProduto = dados.produtos[0];
  const precoPrimeiro = (primeiroProduto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  let conteudoHTML = `
    <div class="header-comprovante">
        <h4>${dados.nome_empresa.toUpperCase()}</h4>
        <div class="nav-comprovante">
`;

  if (temVariosProdutos) {
    conteudoHTML += `
        <p class="options-comprovante btn-mostrar-mais">Mostrar Mais</p>
    `
  }

  conteudoHTML += `
            <p class="options-comprovante btn-deletar" title="Remover">
                <i class="fa-sharp fa-regular fa-trash-can"></i>
            </p>
        </div>
    </div>
`;

  conteudoHTML += `
    <div class="produto-comprovante">
        <p>${primeiroProduto.nome} - ${precoPrimeiro} | ${primeiroProduto.quantidade}x</p>
    </div>
`;

  if (temVariosProdutos) {
    // MODIFICAÇÃO AQUI: Em vez de usar display: none no elemento diretamente, 
    // criamos um "wrapper" (uma caixa por fora) que usa a classe do CSS para fazer a animação.
    conteudoHTML += `<div class="produtos-extras-wrapper"><div class="produtos-extras">`

    for (let i = 1; i < dados.produtos.length; i++) {
      let produtoAtual = dados.produtos[i];
      let precoFormatado = (produtoAtual.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      conteudoHTML += `
            <div class="produto-comprovante" style="color: #4a4a4a; font-size: 0.95em;">
                <p>↳ ${produtoAtual.nome} - ${precoFormatado} | ${produtoAtual.quantidade}x</p>
            </div>
        `;
    }

    conteudoHTML += `</div></div>`; // Fechamos o produtos-extras e o wrapper
  }

  let valorTotalFormatado = (dados.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  conteudoHTML += `
    <div class="caixa-valor-total">
        <p>Valor Total</p>
        <p class="valor-total">${valorTotalFormatado}</p>
    </div>
`;

  comprovante.innerHTML = conteudoHTML;
  boxComprovantes.appendChild(comprovante);

  // Ações dos botões
  const btnDeletar = comprovante.querySelector('.btn-deletar');
  btnDeletar.addEventListener('click', () => {
    removerComprovante(comprovante);
  });

  if (temVariosProdutos) {
    const btnMostrarMais = comprovante.querySelector('.btn-mostrar-mais');

    // Pegamos o wrapper (a div de fora que criamos) que tem as regras da animação no CSS
    const divWrapperExtras = comprovante.querySelector('.produtos-extras-wrapper');

    btnMostrarMais.addEventListener('click', () => {
      // MODIFICAÇÃO DE LÓGICA: 
      // classList.toggle() adiciona a classe 'expandido' se ela não existir, e remove se ela já existir.
      // Isso ativa ou desativa o max-height e o opacity lá no CSS, criando a animação!
      divWrapperExtras.classList.toggle('expandido');

      // Verifica se a div agora possui a classe expandido para mudar o texto
      if (divWrapperExtras.classList.contains('expandido')) {
        btnMostrarMais.textContent = 'Mostrar Menos';
      } else {
        btnMostrarMais.textContent = 'Mostrar Mais';
      }
    });
  }

  // Atualiza os totais
  valor_total_comprovantes += dados.valor_total;
  let total_preco = valor_total_comprovantes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  valorComprovantes.textContent = total_preco;
  comprovantes_loaded += 1;
  quantidadeComprovante.textContent = `${comprovantes_loaded} comprovantes lidos`
}

function removerComprovante(comprovante) {
  const valorComprovante = Number(comprovante.dataset.valorTotal)
  valor_total_comprovantes -= valorComprovante
  comprovantes_loaded -= 1
  valor_total_comprovantes = Math.round(valor_total_comprovantes * 100) / 100

  // Adicionamos uma transição simples antes de deletar do DOM
  comprovante.style.transition = "opacity 0.4s ease";
  comprovante.style.opacity = 0;

  setTimeout(() => {
    comprovante.remove()
    const totalPrecoFormatado = valor_total_comprovantes.toLocaleString(
      'pt-BR',
      { style: 'currency', currency: 'BRL' }
    )
    valorComprovantes.textContent = totalPrecoFormatado
    quantidadeComprovante.textContent = `${comprovantes_loaded} comprovantes lidos`
  }, 500); // Aguarda o fim da animação de opacidade para remover
}

async function flashedNotification(mensagem) {
  const flashedContent = document.createElement('div')
  flashedContent.className = 'flashed-content'
  flashedBox.appendChild(flashedContent)
  flashedContent.innerHTML = `<h4>${mensagem}</h4>`

  setTimeout(function () {
    if (flashedBox.contains(flashedContent)) {
      flashedBox.removeChild(flashedContent)
    }
  }, 5500); // Ajustado para fechar um pouco após o fim da animação css
}
