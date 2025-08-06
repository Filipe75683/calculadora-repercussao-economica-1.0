// JavaScript para PIS e COFINS sobre IPI
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pis-cofins-ipi-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const ipiNaoRecuperavelEl = document.getElementById('ipi-nao-recuperavel');
    const pisSobreIpiEl = document.getElementById('pis-sobre-ipi');
    const cofinsSobreIpiEl = document.getElementById('cofins-sobre-ipi');
    const totalPisCofinsipiEl = document.getElementById('total-pis-cofins-ipi');
    const custoAdicionalEl = document.getElementById('custo-adicional');
    const percentualProdutoEl = document.getElementById('percentual-produto');
    
    // Elementos da tabela de análise
    const analiseIpiTotalEl = document.getElementById('analise-ipi-total');
    const analiseIpiRecuperavelEl = document.getElementById('analise-ipi-recuperavel');
    const analiseIpiNaoRecuperavelEl = document.getElementById('analise-ipi-nao-recuperavel');
    const analisePisCofinsiEl = document.getElementById('analise-pis-cofins');
    
    // Seção de percentual de recuperação
    const percentualRecuperacaoSection = document.getElementById('percentual-recuperacao-section');
    
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
    
    // Função para mostrar/ocultar seção de recuperação parcial
    function toggleRecuperacaoSection() {
        const recuperavel = document.getElementById('recuperavel-ipi').value;
        percentualRecuperacaoSection.style.display = recuperavel === 'parcial' ? 'flex' : 'none';
        calcular();
    }
    
    // Função para calcular
    function calcular() {
        const ipiProdutoRevenda = parseFloat(document.getElementById('ipi-produto-revenda').value) || 0;
        const aliquotaPis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const aliquotaCofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        const aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
        const valorProduto = parseFloat(document.getElementById('valor-produto').value) || 0;
        const recuperavelIpi = document.getElementById('recuperavel-ipi').value;
        const percentualRecuperacao = parseFloat(document.getElementById('percentual-recuperacao').value) || 0;
        
        if (ipiProdutoRevenda === 0 && valorProduto === 0) {
            limparResultados();
            return;
        }
        
        // Determinar IPI total
        let ipiTotal = ipiProdutoRevenda;
        if (ipiTotal === 0 && valorProduto > 0 && aliquotaIpi > 0) {
            ipiTotal = valorProduto * (aliquotaIpi / 100);
        }
        
        // Calcular IPI recuperável e não recuperável
        let ipiRecuperavel = 0;
        let ipiNaoRecuperavel = ipiTotal;
        
        switch (recuperavelIpi) {
            case 'sim':
                ipiRecuperavel = ipiTotal;
                ipiNaoRecuperavel = 0;
                break;
            case 'parcial':
                ipiRecuperavel = ipiTotal * (percentualRecuperacao / 100);
                ipiNaoRecuperavel = ipiTotal - ipiRecuperavel;
                break;
            case 'nao':
            default:
                ipiRecuperavel = 0;
                ipiNaoRecuperavel = ipiTotal;
                break;
        }
        
        // Calcular PIS e COFINS sobre IPI não recuperável
        const pisSobreIpi = ipiNaoRecuperavel * (aliquotaPis / 100);
        const cofinsSobreIpi = ipiNaoRecuperavel * (aliquotaCofins / 100);
        const totalPisCofinsIpi = pisSobreIpi + cofinsSobreIpi;
        
        // Custo adicional total
        const custoAdicional = ipiNaoRecuperavel + totalPisCofinsIpi;
        
        // Percentual sobre valor do produto
        const percentualProduto = valorProduto > 0 ? (custoAdicional / valorProduto) * 100 : 0;
        
        // Atualizar resultados principais
        ipiNaoRecuperavelEl.textContent = formatCurrency(ipiNaoRecuperavel);
        pisSobreIpiEl.textContent = formatCurrency(pisSobreIpi);
        cofinsSobreIpiEl.textContent = formatCurrency(cofinsSobreIpi);
        totalPisCofinsipiEl.textContent = formatCurrency(totalPisCofinsIpi);
        custoAdicionalEl.textContent = formatCurrency(custoAdicional);
        percentualProdutoEl.textContent = formatPercentage(percentualProduto);
        
        // Atualizar tabela de análise
        analiseIpiTotalEl.textContent = formatCurrency(ipiTotal);
        analiseIpiRecuperavelEl.textContent = formatCurrency(ipiRecuperavel);
        analiseIpiNaoRecuperavelEl.textContent = formatCurrency(ipiNaoRecuperavel);
        analisePisCofinsiEl.textContent = formatCurrency(totalPisCofinsIpi);
    }
    
    // Função para limpar resultados
    function limparResultados() {
        ipiNaoRecuperavelEl.textContent = formatCurrency(0);
        pisSobreIpiEl.textContent = formatCurrency(0);
        cofinsSobreIpiEl.textContent = formatCurrency(0);
        totalPisCofinsipiEl.textContent = formatCurrency(0);
        custoAdicionalEl.textContent = formatCurrency(0);
        percentualProdutoEl.textContent = formatPercentage(0);
        
        analiseIpiTotalEl.textContent = formatCurrency(0);
        analiseIpiRecuperavelEl.textContent = formatCurrency(0);
        analiseIpiNaoRecuperavelEl.textContent = formatCurrency(0);
        analisePisCofinsiEl.textContent = formatCurrency(0);
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
    document.getElementById('recuperavel-ipi').addEventListener('change', toggleRecuperacaoSection);
    document.getElementById('regime-tributario').addEventListener('change', definirAliquotasPadrao);
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    ['ipi-produto-revenda', 'valor-produto'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });
    
    ['aliquota-pis', 'aliquota-cofins', 'aliquota-ipi', 'percentual-recuperacao'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
                if (this.value > 100) this.value = 100;
            });
        }
    });
    
    // Função para calcular IPI baseado no valor do produto
    document.getElementById('valor-produto').addEventListener('input', function() {
        const valorProduto = parseFloat(this.value) || 0;
        const aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
        
        if (valorProduto > 0 && aliquotaIpi > 0) {
            const ipiCalculado = valorProduto * (aliquotaIpi / 100);
            document.getElementById('ipi-produto-revenda').value = ipiCalculado.toFixed(2);
            calcular();
        }
    });
});

