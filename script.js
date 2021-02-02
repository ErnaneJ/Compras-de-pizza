let cart = []; //variavel do carrinho
let modalQt = 1; //variavel de armazenamento da quantidade de pizzas selecionadas no modal
let modalKey = 0; // variavel que identifica qual e a pizza em todo o codigo
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
/*funções para facilitar a vida servem para selecionar o 
   item sem precisar repetir 'document.querySelector()' ou 
   'document.querySelectorAll()'
*/

//listagem das pizzas
pizzaJson.map((item, index) => { //acessando as pizzas e cada incice dentro do array
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //preencher as informações em pizzaitem

    //armazenando qual é a pizza clicada
    pizzaItem.setAttribute('data-key', index);

    //adicionando Imagem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    //adicionando nome
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    //adiocionando preco
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    //adicionando desccricao
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //ajustando link para abertura do modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        //pegando a informação de qual pizza foi clicada
        //closest -> procurar o elemento mais proximo
        //getAttribute -> pega o dado setado no data-key
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //resetando quantidade de pizzas selecionadas quando abrir o modal
        modalQt = 1;

        //salvando qual é a pizza clicada
        modalKey = key;

        //preenchendo as informações da pizza clicada no modal
        //Adicionando imagem da pizza no modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        //Adicionando nome da pizza no modal
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        //Adicionando descicao da pizza no modal
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        //Adicionando preco da pizza no modal
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //descelecionando os itens de tamanhos selecionados
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //tamanhos
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //colocando o grande como seleção padrão
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //salvando a quantidade selecionada
        c('.pizzaInfo--qt').innerHTML = modalQt;

        //mostrando o modal
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    c('.pizza-area').append(pizzaItem); //coloca na tela uma depois da outra, innerHTML substituiria

});

//Eventos do MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 200);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//botoes mais e menos
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//selecionando os tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    //pegando tamanho da pizza
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + "@" + size;

    //verificando se o item ja existe no carrinho
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        //adicionando ao carrinho (objeto)
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    //atualizar o carrinho
    updateCart();
    //fechando o modal depois de selecionar as pizzas
    closeModal();
});
//mostrando o aside no mobile
c('.menu-openner span').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})



//atualizador do carrinho
function updateCart() {
    //carrinho mobile
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        //zerando para poder colocar os itens
        c('.cart').innerHTML = '';

        //variaveis controladora dos preços
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //mostrando item a item no carrinho
        for (let i in cart) {
            //pegando todos os dados da pizza
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

            //calculando o subtotal
            subtotal += pizzaItem.price * cart[i].qt;

            //clonando e o model do carrinho para cada item
            let cartItem = c('.models .cart--item').cloneNode(true);


            //colocando tamanho no nome para situar  cliente
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            //preenchendo os dados model do carrinho para cada item
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            //botoes mais e menos no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            //mostrando ao model do carrinho para cada item
            c('.cart').append(cartItem);
        }
        //calculando desconto e total
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        //exibindo total, subtotal e desconto
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
c('.cart--finalizar').addEventListener('click', () => {
   alert("Compra realizada com sucessso!\nFeito com ❤ por Ernane Ferreira")
});
