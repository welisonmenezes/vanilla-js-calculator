'use strict';

/****************************************************************************************
 * Variáveis
 ****************************************************************************************/

// Selecionando os elementos html
const $display = document.querySelector('.display'),
    $historico = document.querySelector('.historico'),
    $numeros = document.querySelectorAll('.numero'),
    $operadores = document.querySelectorAll('.operador'),
    $resultado = document.querySelector('.resultado'),
    $limpar = document.querySelector('.limpar'),
    $limparAtual = document.querySelector('.limpar-atual'),
    $voltar = document.querySelector('.voltar'),
    $trocaSinal = document.querySelector('.troca-sinal');

// Operadores válidos
const operadoresValidos = ['+', '-', '×', '÷'],
    naoNumeros = operadoresValidos.concat(['.', '=', 'C', 'CE', '=/-']);

// Memória/Controle
const numeros = [], operadores = [];
let digitoAtual = '0';


/****************************************************************************************
 * Eventos
 ****************************************************************************************/

$numeros.forEach(($numero) => {
    $numero.addEventListener('click', digitarNumero);
});

$operadores.forEach(($operador) => {
    $operador.addEventListener('click', digitarOperador);
});

$limpar.addEventListener('click', limparTudo);

$limparAtual.addEventListener('click', limparDigitoAtual);

$voltar.addEventListener('click', voltarDigito);

$trocaSinal.addEventListener('click', trocarSinal);

$resultado.addEventListener('click', mostrarResultado);


/****************************************************************************************
 * Funções
 ****************************************************************************************/

// Rola as barras de scroll do display e do histórico sempre para o final
function posicionarScrollbar() {
    $display.scrollLeft = $display.scrollWidth;
    $historico.scrollLeft = $historico.scrollWidth;
}

// Se dígito atual é igual à '=' o resultado do cálculo foi requerido
function resultadoMostrado() {
    return digitoAtual === '=';
}

// Se o dígito atual não está no array naoNumeros é número válido
function eNumeroValido() {
    return ! naoNumeros.includes(digitoAtual);
}

// Se o dígito atual está no array operadoresValidos é operador válido
function eOperadorValido() {
    return operadoresValidos.includes(digitoAtual);
}

// Captura o dígito numérico atual e o imprime
function digitarNumero() {

    // permitir apenas um ponto (.) no dígito atual
    if (digitoAtual.includes('.') && event.target.innerHTML === '.') return;

    if (resultadoMostrado()) {
        // se o resultado já foi requerido, limpar tudo
        limparTudo();
        digitoAtual = event.target.innerHTML;
        
    } else {
        // se dígito atual é operador, seta-o como zero
        if (eOperadorValido()) {
            digitoAtual = '0';
        }

        // atualiza o dígito atual, se zero, atribui, senão, concatena
        if (digitoAtual === '0') {
            digitoAtual = event.target.innerHTML;

        } else {
            digitoAtual += event.target.innerHTML;
        }
    }

    // se dígito atual é igual à '.', adiciona um zero à frente
    if(digitoAtual === '.') {
        digitoAtual = '0' + event.target.innerHTML;
    }

    atualizarDisplay(digitoAtual);
}

// Captura o operador digitado
function digitarOperador() {

    // se dígito atual ainda não existe ou já é operador, operador não é necessário
    if (digitoAtual === '' || eOperadorValido()) {

        // Se digito atual for operador, permitir trocar último operador
        if (operadores.length === numeros.length) {
            operadores[operadores.length-1] = event.target.innerHTML;
            atualizarHistorico();
        }

        return;
    }

    // se resultado ainda não foi requerido, formatar/adicionar dígito atual ao array de números
    if (! resultadoMostrado()) {
        // formata corretamente números fracionais digitados
        if (digitoAtual * 1 === 0 || (digitoAtual.length === 1 && digitoAtual === '.')) {
            digitoAtual = '0';
        } else if (digitoAtual[digitoAtual.length - 1] === '.') {
            digitoAtual += '0';
        }

        // adiciona número ao array de numeros
        numeros.push(digitoAtual);
    }
    
    // atualiza o dígito atual
    digitoAtual = event.target.innerHTML;

    // adicionar dígito atual atualiado ao array de operadores
    operadores.push(digitoAtual);
    
    atualizarHistorico();
    atualizarDisplay(retornarResultadoGeral());
}

// Atualiza o histórico na tela
function atualizarHistorico(valorPraMostrar = null) {

    // Se parâmetro é nulo, exibir à partir de arrays de memória
    if (valorPraMostrar === null) {
        let numeroMostrado = '';

        numeros.forEach((numero, index) => {
            numeroMostrado += numero;

            if (operadores[index]) {
                numeroMostrado += operadores[index];
            }
        });

        $historico.innerHTML = numeroMostrado;

    } else {
        $historico.innerHTML = valorPraMostrar;
    }

    posicionarScrollbar();
}

// Atualiza o display na tela
function atualizarDisplay(valorPraMostrar = '0') {
    $display.innerHTML = valorPraMostrar;
    posicionarScrollbar();
}

// Limpa digito atual, arrays de memória e infos na tela
function limparTudo() {
    digitoAtual = '0';
    atualizarHistorico('');
    atualizarDisplay('0');
    resetarArrays();
}

// Limpa os arrays de memória
function resetarArrays() {
    numeros.length = 0;
    operadores.length = 0;
}

// Limpa o digito atual
function limparDigitoAtual() {

    // se resultado já foi requerido, limpar tudo
    if (resultadoMostrado()) {
        limparTudo();
    } else {
        digitoAtual = '0';
        atualizarDisplay(digitoAtual);
    }
}

// Voltar último dígito numérico digitado
function voltarDigito() {

    // se resultado já foi requerido, faça nada
    if (resultadoMostrado()) {
        return;
    }

    // se dígito atual não for um operador
    if (! eOperadorValido()) {
        digitoAtual = digitoAtual.slice(0, -1);

        if (digitoAtual.length < 1) {
            digitoAtual = '0';
        }

        atualizarDisplay(digitoAtual);
    }
}

// Trocar sinal (+ ou -)
function trocarSinal() {

    // se resultado já foi requerido, limpar tudo
    if (resultadoMostrado()) {
        limparTudo();
    }

    // se dígito atual é numero válido e maior que zero
    if (eNumeroValido() && parseFloat(digitoAtual) * 1 !== 0) {
        const primeiroCaracter = digitoAtual.charAt(0);

        if (primeiroCaracter === '-') {
            digitoAtual = digitoAtual.substring(1);

        } else {
            digitoAtual = '-' + digitoAtual;
        }

        atualizarDisplay(digitoAtual);
    }
}

// Exibe o resultado do cálculo
function mostrarResultado() {

    // se resultado ainda não foi requerido
    if (!resultadoMostrado()) {

        // se é número válido, atualizar array de números
        if (eNumeroValido()) {
            numeros.push(digitoAtual);
        }
        atualizarHistorico();
        atualizarDisplay(retornarResultadoGeral());
        digitoAtual = event.target.innerHTML;
    }
}

// Faz o calculo baseado nas infos salvas nos arrays de memória
function retornarResultadoGeral() {
    let resultado = numeros[0];

    numeros.forEach((numero, index) => {
        if (operadores[index-1]) { 
            resultado = retornarResultadoIndividual(operadores[index-1], resultado, numero);
        }
    });

    try {
        return resultado.toFixed(6) * 1;
    } catch (error) {}

    return resultado;
}

// Faz um cálculo baseado nos parâmetros informados
function retornarResultadoIndividual(operador, numero1, numero2) {
    let resultado;

    if (operador === '÷') {
        resultado = (numero1 === undefined) ? numero2 : parseFloat(numero1) / parseFloat(numero2);
    }
    if (operador === '×') {
        resultado = (numero1 === undefined) ? numero2 : parseFloat(numero1) * parseFloat(numero2);
    }
    if (operador === '-') {
        resultado = (numero1 === undefined) ? numero2 : parseFloat(numero1) - parseFloat(numero2);
    }
    if (operador === '+') {
        resultado = (numero1 === undefined) ? numero2 : parseFloat(numero1) + parseFloat(numero2);
    }

    return resultado;
}