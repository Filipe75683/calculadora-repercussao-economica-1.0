// JavaScript para ICMS Entrada PIS COFINS
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('icms-entrada-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const valorSemIcmsEl = document.getElementById('valor-sem-icms');
    const icmsCreditavelEl = document.getElementById('icms-creditavel');
    const icmsNaoCreditavelEl = document.getElementById('icms-nao-creditavel');
    const basePisCofinsEl = document.getElementById('base-pis-cofins');
    const creditoPisEl = document.getElementById('credito-pis');
    const creditoCofinsEl = document.getElementById('credito-cofins');
    const totalCreditosEl = document.getElementById('total-creditos');
    const beneficioTotalEl = document.getElementById('beneficio-total');
    
    // Elementos da tabela comparativa
    const cenarioTotalBaseEl = document.getElementById('cenario-total-base');
    const cenarioTotalPisEl = document.getElementById('cenario-total-pis');
    const cenarioTotalCofinsEl = document.getElementById('cenario-total-cofins');
    const cenarioTotalCreditosEl = document.getElementById('cenario-total-creditos');
    
    const cenarioNaoBaseEl = document.getElementById('cenario-nao-base');
    const cenarioNaoPisEl = document.getElementById('cenario-nao-pis');
    const cenarioNaoCofinsEl = document.getElementById('cenario-nao-cofins');
    const cenarioNaoCreditosEl = document.getElementById('cenario-nao-creditos');
    
    const diferencaBaseEl = document.getElementById('diferenca-base');
    const diferencaPisEl = document.getElementById('diferenca-pis');
    const diferencaCofinsEl = document.getElementById('diferenca-cofins');
    const diferencaCreditosEl = document.getElementById('diferenca-creditos');
    
    // Seção de percentual de crédito
    const percentualCreditoSection = document.getElementById('percentual-credito-section');
    
    // Função para formatar moeda
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    // Função para formatar porcentagem
    function formatPercentage(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }
    
    // Função para mostrar/ocultar seção de percentual de crédito
    function togglePercentualCreditoSection() {
        const creditoAproveitavel = document.getElementById('credito-aproveitavel').value;
        percentualCreditoSection.style.display = creditoAproveitavel === 'parcial' ? 'flex' : 'none';
        calcular();
    }
    
    // Função para calcular
    function calcular() {
        const valorCompra = parseFloat(document.getElementById('valor-compra').value) || 0;
        const icmsEntrada = parseFloat(document.getElementById('icms-entrada').value) || 0;
        const aliquotaIcms = parseFloat(document.getElementById('aliquota-icms').value) || 0;
        const aliquotaPis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const aliquotaCofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        const creditoAproveitavel = document.getElementById('credito-aproveitavel').value;
        const percentualCredito = parseFloat(document.getElementById('percentual-credito').value) || 0;
        
        if (valorCompra === 0) {
            limparResultados();
            return;
        }
        
        // Calcular ICMS se não informado
        let icmsCalculado = icmsEntrada;
        if (icmsCalculado === 0 && aliquotaIcms > 0) {
            icmsCalculado = valorCompra * (aliquotaIcms / 100);
        }
        
        // Valor da compra sem ICMS
        const valorSemIcms = valorCompra - icmsCalculado;
        
        // Determinar ICMS creditável e não creditável
        let icmsCreditavel = 0;
        let icmsNaoCreditavel = icmsCalculado;
        
        switch (creditoAproveitavel) {
            case 'sim':
                icmsCreditavel = icmsCalculado;
                icmsNaoCreditavel = 0;
                break;
            case 'parcial':
                icmsCreditavel = icmsCalculado * (percentualCredito / 100);
                icmsNaoCreditavel = icmsCalculado - icmsCreditavel;
                break;
            case 'nao':
            default:
                icmsCreditavel = 0;
                icmsNaoCreditavel = icmsCalculado;
                break;
        }
        
        // Base de cálculo PIS/COFINS (inclui ICMS não creditável)
        const basePisCofins = valorSemIcms + icmsNaoCreditavel;
        
        // Créditos PIS e COFINS
        const creditoPis = basePisCofins * (aliquotaPis / 100);
        const creditoCofins = basePisCofins * (aliquotaCofins / 100);
        const totalCreditos = creditoPis + creditoCofins;
        
        // Benefício fiscal total (crédito ICMS + créditos PIS/COFINS)
        const beneficioTotal = icmsCreditavel + totalCreditos;
        
        // Atualizar resultados principais
        valorSemIcmsEl.textContent = formatCurrency(valorSemIcms);
        icmsCreditavelEl.textContent = formatCurrency(icmsCreditavel);
        icmsNaoCreditavelEl.textContent = formatCurrency(icmsNaoCreditavel);
        basePisCofinsEl.textContent = formatCurrency(basePisCofins);
        creditoPisEl.textContent = formatCurrency(creditoPis);
        creditoCofinsEl.textContent = formatCurrency(creditoCofins);
        totalCreditosEl.textContent = formatCurrency(totalCreditos);
        beneficioTotalEl.textContent = formatCurrency(beneficioTotal);
        
        // Calcular cenários para tabela comparativa
        // Cenário 1: ICMS totalmente creditável
        const basePisCofinsTotal = valorSemIcms; // Sem ICMS na base
        const creditoPisTotal = basePisCofinsTotal * (aliquotaPis / 100);
        const creditoCofinsTotal = basePisCofinsTotal * (aliquotaCofins / 100);
        const totalCreditosTotal = creditoPisTotal + creditoCofinsTotal;
        
        // Cenário 2: ICMS não creditável
        const basePisCofinsNao = valorCompra; // Com ICMS na base
        const creditoPisNao = basePisCofinsNao * (aliquotaPis / 100);
        const creditoCofinsNao = basePisCofinsNao * (aliquotaCofins / 100);
        const totalCreditosNao = creditoPisNao + creditoCofinsNao;
        
        // Diferenças
        const diferencaBase = basePisCofinsNao - basePisCofinsTotal;
        const diferencaPis = creditoPisNao - creditoPisTotal;
        const diferencaCofins = creditoCofinsNao - creditoCofinsTotal;
        const diferencaCreditos = totalCreditosNao - totalCreditosTotal;
        
        // Atualizar tabela comparativa
        cenarioTotalBaseEl.textContent = formatCurrency(basePisCofinsTotal);
        cenarioTotalPisEl.textContent = formatCurrency(creditoPisTotal);
        cenarioTotalCofinsEl.textContent = formatCurrency(creditoCofinsTotal);
        cenarioTotalCreditosEl.textContent = formatCurrency(totalCreditosTotal);
        
        cenarioNaoBaseEl.textContent = formatCurrency(basePisCofinsNao);
        cenarioNaoPisEl.textContent = formatCurrency(creditoPisNao);
        cenarioNaoCofinsEl.textContent = formatCurrency(creditoCofinsNao);
        cenarioNaoCreditosEl.textContent = formatCurrency(totalCreditosNao);
        
        diferencaBaseEl.textContent = formatCurrency(diferencaBase);
        diferencaPisEl.textContent = formatCurrency(diferencaPis);
        diferencaCofinsEl.textContent = formatCurrency(diferencaCofins);
        diferencaCreditosEl.textContent = formatCurrency(diferencaCreditos);
    }
    
    // Função para limpar resultados
    function limparResultados() {
        valorSemIcmsEl.textContent = formatCurrency(0);
        icmsCreditavelEl.textContent = formatCurrency(0);
        icmsNaoCreditavelEl.textContent = formatCurrency(0);
        basePisCofinsEl.textContent = formatCurrency(0);
        creditoPisEl.textContent = formatCurrency(0);
        creditoCofinsEl.textContent = formatCurrency(0);
        totalCreditosEl.textContent = formatCurrency(0);
        beneficioTotalEl.textContent = formatCurrency(0);
        
        // Limpar tabela comparativa
        [cenarioTotalBaseEl, cenarioTotalPisEl, cenarioTotalCofinsEl, cenarioTotalCreditosEl,
         cenarioNaoBaseEl, cenarioNaoPisEl, cenarioNaoCofinsEl, cenarioNaoCreditosEl,
         diferencaBaseEl, diferencaPisEl, diferencaCofinsEl, diferencaCreditosEl].forEach(el => {
            el.textContent = formatCurrency(0);
        });
    }
    
    // Função para definir alíquotas padrão baseadas no regime
    function definirAliquotasPadrao() {
        const regime = document.getElementById('regime-tributario').value;
        const aliquotaPisEl = document.getElementById('aliquota-pis');
        const aliquotaCofinsEl = document.getElementById('aliquota-cofins');
        
        switch (regime) {
            case 'lucro-real':
                aliquotaPisEl.value = '1.65';
                aliquotaCofinsEl.value = '7.60';
                break;
            case 'lucro-presumido':
                aliquotaPisEl.value = '0.65';
                aliquotaCofinsEl.value = '3.00';
                break;
            case 'simples':
                aliquotaPisEl.value = '0.00';
                aliquotaCofinsEl.value = '0.00';
                break;
        }
        
        calcular();
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    // Event listeners específicos
    document.getElementById('credito-aproveitavel').addEventListener('change', togglePercentualCreditoSection);
    document.getElementById('regime-tributario').addEventListener('change', definirAliquotasPadrao);
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    ['valor-compra', 'icms-entrada'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });
    
    ['aliquota-icms', 'aliquota-pis', 'aliquota-cofins', 'percentual-credito'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
                if (this.value > 100) this.value = 100;
            });
        }
    });
    
    // Função para calcular ICMS automaticamente
    document.getElementById('valor-compra').addEventListener('input', function() {
        const valorCompra = parseFloat(this.value) || 0;
        const aliquotaIcms = parseFloat(document.getElementById('aliquota-icms').value) || 0;
        
        if (valorCompra > 0 && aliquotaIcms > 0) {
            const icmsCalculado = valorCompra * (aliquotaIcms / 100);
            document.getElementById('icms-entrada').value = icmsCalculado.toFixed(2);
            calcular();
        }
    });
    
    document.getElementById('aliquota-icms').addEventListener('input', function() {
        const valorCompra = parseFloat(document.getElementById('valor-compra').value) || 0;
        const aliquotaIcms = parseFloat(this.value) || 0;
        
        if (valorCompra > 0 && aliquotaIcms > 0) {
            const icmsCalculado = valorCompra * (aliquotaIcms / 100);
            document.getElementById('icms-entrada').value = icmsCalculado.toFixed(2);
            calcular();
        }
    });
});

