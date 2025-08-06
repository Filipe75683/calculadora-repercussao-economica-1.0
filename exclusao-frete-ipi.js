// JavaScript para cálculo de Exclusão Frete IPI
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('exclusao-frete-ipi-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const valorTotalOperacaoEl = document.getElementById('valor-total-operacao');
    const baseIpiComFreteEl = document.getElementById('base-ipi-com-frete');
    const baseIpiSemFreteEl = document.getElementById('base-ipi-sem-frete');
    const ipiComFreteEl = document.getElementById('ipi-com-frete');
    const ipiSemFreteEl = document.getElementById('ipi-sem-frete');
    const economiaExclusaoEl = document.getElementById('economia-exclusao');
    const percentualEconomiaEl = document.getElementById('percentual-economia');
    
    // Elementos da tabela detalhada
    const detalheProdutoEl = document.getElementById('detalhe-produto');
    const detalheFreteEl = document.getElementById('detalhe-frete');
    const detalheSeguroEl = document.getElementById('detalhe-seguro');
    const detalheOutrasEl = document.getElementById('detalhe-outras');
    const economiaFreteEl = document.getElementById('economia-frete');
    const economiaSeguroEl = document.getElementById('economia-seguro');
    const economiaOutrasEl = document.getElementById('economia-outras');
    
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
    
    // Função para calcular
    function calcular() {
        const valorProduto = parseFloat(document.getElementById('valor-produto').value) || 0;
        const valorFrete = parseFloat(document.getElementById('valor-frete').value) || 0;
        const valorSeguro = parseFloat(document.getElementById('valor-seguro').value) || 0;
        const outrasDespesas = parseFloat(document.getElementById('outras-despesas').value) || 0;
        const aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
        
        if (valorProduto === 0 || aliquotaIpi === 0) {
            // Limpar resultados se não há dados suficientes
            valorTotalOperacaoEl.textContent = formatCurrency(0);
            baseIpiComFreteEl.textContent = formatCurrency(0);
            baseIpiSemFreteEl.textContent = formatCurrency(0);
            ipiComFreteEl.textContent = formatCurrency(0);
            ipiSemFreteEl.textContent = formatCurrency(0);
            economiaExclusaoEl.textContent = formatCurrency(0);
            percentualEconomiaEl.textContent = formatPercentage(0);
            
            // Limpar tabela detalhada
            detalheProdutoEl.textContent = formatCurrency(0);
            detalheFreteEl.textContent = formatCurrency(0);
            detalheSeguroEl.textContent = formatCurrency(0);
            detalheOutrasEl.textContent = formatCurrency(0);
            economiaFreteEl.textContent = formatCurrency(0);
            economiaSeguroEl.textContent = formatCurrency(0);
            economiaOutrasEl.textContent = formatCurrency(0);
            return;
        }
        
        // Cálculos principais
        const valorTotalOperacao = valorProduto + valorFrete + valorSeguro + outrasDespesas;
        
        // Base de cálculo do IPI com frete e despesas
        const baseIpiComFrete = valorTotalOperacao;
        
        // Base de cálculo do IPI sem frete e despesas (apenas produto)
        const baseIpiSemFrete = valorProduto;
        
        // IPI calculado com frete
        const ipiComFrete = baseIpiComFrete * (aliquotaIpi / 100);
        
        // IPI calculado sem frete
        const ipiSemFrete = baseIpiSemFrete * (aliquotaIpi / 100);
        
        // Economia com a exclusão
        const economiaExclusao = ipiComFrete - ipiSemFrete;
        
        // Percentual de economia
        const percentualEconomia = ipiComFrete > 0 ? (economiaExclusao / ipiComFrete) * 100 : 0;
        
        // Atualizar resultados principais
        valorTotalOperacaoEl.textContent = formatCurrency(valorTotalOperacao);
        baseIpiComFreteEl.textContent = formatCurrency(baseIpiComFrete);
        baseIpiSemFreteEl.textContent = formatCurrency(baseIpiSemFrete);
        ipiComFreteEl.textContent = formatCurrency(ipiComFrete);
        ipiSemFreteEl.textContent = formatCurrency(ipiSemFrete);
        economiaExclusaoEl.textContent = formatCurrency(economiaExclusao);
        percentualEconomiaEl.textContent = formatPercentage(percentualEconomia);
        
        // Cálculos detalhados por tipo de despesa
        const economiaFrete = valorFrete * (aliquotaIpi / 100);
        const economiaSeguro = valorSeguro * (aliquotaIpi / 100);
        const economiaOutras = outrasDespesas * (aliquotaIpi / 100);
        
        // Atualizar tabela detalhada
        detalheProdutoEl.textContent = formatCurrency(valorProduto);
        detalheFreteEl.textContent = formatCurrency(valorFrete);
        detalheSeguroEl.textContent = formatCurrency(valorSeguro);
        detalheOutrasEl.textContent = formatCurrency(outrasDespesas);
        economiaFreteEl.textContent = formatCurrency(economiaFrete);
        economiaSeguroEl.textContent = formatCurrency(economiaSeguro);
        economiaOutrasEl.textContent = formatCurrency(economiaOutras);
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    document.getElementById('valor-produto').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('valor-frete').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('valor-seguro').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('outras-despesas').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('aliquota-ipi').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    // Função para simular diferentes cenários
    window.simularCenarios = function() {
        const valorProduto = parseFloat(document.getElementById('valor-produto').value) || 0;
        const valorFrete = parseFloat(document.getElementById('valor-frete').value) || 0;
        const aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
        
        if (valorProduto === 0 || aliquotaIpi === 0) {
            alert('Por favor, preencha o valor do produto e a alíquota do IPI para simular cenários.');
            return;
        }
        
        const cenarios = [
            { nome: 'Sem Frete', frete: 0 },
            { nome: 'Frete Atual', frete: valorFrete },
            { nome: 'Frete +50%', frete: valorFrete * 1.5 },
            { nome: 'Frete +100%', frete: valorFrete * 2 }
        ];
        
        let relatorio = 'SIMULAÇÃO DE CENÁRIOS - EXCLUSÃO FRETE IPI\n';
        relatorio += '='.repeat(50) + '\n\n';
        relatorio += `Valor do Produto: ${formatCurrency(valorProduto)}\n`;
        relatorio += `Alíquota IPI: ${aliquotaIpi.toFixed(2)}%\n\n`;
        
        cenarios.forEach(cenario => {
            const baseComFrete = valorProduto + cenario.frete;
            const baseSemFrete = valorProduto;
            const ipiComFrete = baseComFrete * (aliquotaIpi / 100);
            const ipiSemFrete = baseSemFrete * (aliquotaIpi / 100);
            const economia = ipiComFrete - ipiSemFrete;
            
            relatorio += `${cenario.nome}:\n`;
            relatorio += `  Frete: ${formatCurrency(cenario.frete)}\n`;
            relatorio += `  IPI com frete: ${formatCurrency(ipiComFrete)}\n`;
            relatorio += `  IPI sem frete: ${formatCurrency(ipiSemFrete)}\n`;
            relatorio += `  Economia: ${formatCurrency(economia)}\n\n`;
        });
        
        const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulacao-exclusao-frete-ipi-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Função para calcular economia anual
    window.calcularEconomiaAnual = function() {
        const economiaExclusao = parseFloat(economiaExclusaoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const periodo = document.getElementById('periodo-calculo').value;
        
        let multiplicador = 1;
        switch (periodo) {
            case 'mensal':
                multiplicador = 12;
                break;
            case 'trimestral':
                multiplicador = 4;
                break;
            case 'semestral':
                multiplicador = 2;
                break;
            case 'anual':
                multiplicador = 1;
                break;
        }
        
        const economiaAnual = economiaExclusao * multiplicador;
        
        alert(`Economia Anual Estimada:
        
Economia por ${periodo}: ${formatCurrency(economiaExclusao)}
Economia anual: ${formatCurrency(economiaAnual)}
        
Observação: Este cálculo considera que os valores se repetem uniformemente ao longo do ano.`);
    };
    
    // Função para exportar dados
    window.exportarDados = function() {
        const dados = {
            data: new Date().toLocaleDateString('pt-BR'),
            entrada: {
                valorProduto: parseFloat(document.getElementById('valor-produto').value) || 0,
                valorFrete: parseFloat(document.getElementById('valor-frete').value) || 0,
                valorSeguro: parseFloat(document.getElementById('valor-seguro').value) || 0,
                outrasDespesas: parseFloat(document.getElementById('outras-despesas').value) || 0,
                aliquotaIpi: parseFloat(document.getElementById('aliquota-ipi').value) || 0,
                tipoOperacao: document.getElementById('tipo-operacao').value,
                ncm: document.getElementById('ncm').value,
                modalidadeFrete: document.getElementById('modalidade-frete').value,
                periodoCalculo: document.getElementById('periodo-calculo').value
            },
            resultados: {
                valorTotalOperacao: parseFloat(valorTotalOperacaoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                baseIpiComFrete: parseFloat(baseIpiComFreteEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                baseIpiSemFrete: parseFloat(baseIpiSemFreteEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                ipiComFrete: parseFloat(ipiComFreteEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                ipiSemFrete: parseFloat(ipiSemFreteEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                economiaExclusao: parseFloat(economiaExclusaoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                percentualEconomia: parseFloat(percentualEconomiaEl.textContent.replace(/[^\d,%]/g, '').replace(',', '.')) || 0
            }
        };
        
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exclusao-frete-ipi-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Adicionar botões de ação se não existirem
    if (!document.getElementById('acoes-exclusao-frete')) {
        const acoesDiv = document.createElement('div');
        acoesDiv.id = 'acoes-exclusao-frete';
        acoesDiv.className = 'text-center mt-2';
        acoesDiv.innerHTML = `
            <button onclick="simularCenarios()" class="btn">Simular Cenários</button>
            <button onclick="calcularEconomiaAnual()" class="btn" style="margin-left: 1rem;">Economia Anual</button>
            <button onclick="exportarDados()" class="btn" style="margin-left: 1rem;">Exportar Dados</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(acoesDiv);
        }
    }
});

