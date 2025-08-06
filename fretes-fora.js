// JavaScript para cálculo de Fretes Fora
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fretes-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const faturamentoTotalEl = document.getElementById('faturamento-total');
    const fretesTotaisEl = document.getElementById('fretes-totais');
    const fretesForaValorEl = document.getElementById('fretes-fora-valor');
    const icmsFretesForaEl = document.getElementById('icms-fretes-fora');
    const beneficioFiscalEl = document.getElementById('beneficio-fiscal');
    const percentualFaturamentoEl = document.getElementById('percentual-faturamento');
    
    // Elementos da tabela detalhada
    const cfop5932FatEl = document.getElementById('cfop-5932-fat');
    const cfop5932PercEl = document.getElementById('cfop-5932-perc');
    const cfop5932FreteEl = document.getElementById('cfop-5932-frete');
    const cfop5932IcmsEl = document.getElementById('cfop-5932-icms');
    
    const cfop6932FatEl = document.getElementById('cfop-6932-fat');
    const cfop6932PercEl = document.getElementById('cfop-6932-perc');
    const cfop6932FreteEl = document.getElementById('cfop-6932-frete');
    const cfop6932IcmsEl = document.getElementById('cfop-6932-icms');
    
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
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).format(value / 100);
    }
    
    // Função para calcular
    function calcular() {
        const faturamento5932 = parseFloat(document.getElementById('faturamento-5932').value) || 0;
        const faturamento6932 = parseFloat(document.getElementById('faturamento-6932').value) || 0;
        const percentualFreteFora = parseFloat(document.getElementById('percentual-frete-fora').value) || 0;
        const percentualIcms = parseFloat(document.getElementById('percentual-icms').value) || 0;
        const valorFreteTotal = parseFloat(document.getElementById('valor-frete-total').value) || 0;
        
        // Cálculos principais
        const faturamentoTotal = faturamento5932 + faturamento6932;
        
        // Se valor do frete total não foi informado, calcular baseado no percentual
        let fretesTotais = valorFreteTotal;
        if (fretesTotais === 0 && percentualFreteFora > 0) {
            fretesTotais = faturamentoTotal * (percentualFreteFora / 100);
        }
        
        const fretesForaValor = fretesTotais * (percentualFreteFora / 100);
        const icmsFretesForaValor = fretesForaValor * (percentualIcms / 100);
        
        // Benefício fiscal (economia com ICMS sobre fretes fora)
        const beneficioFiscal = icmsFretesForaValor;
        
        // Percentual sobre faturamento
        const percentualSobreFaturamento = faturamentoTotal > 0 ? (fretesForaValor / faturamentoTotal) * 100 : 0;
        
        // Atualizar resultados principais
        faturamentoTotalEl.textContent = formatCurrency(faturamentoTotal);
        fretesTotaisEl.textContent = formatCurrency(fretesTotais);
        fretesForaValorEl.textContent = formatCurrency(fretesForaValor);
        icmsFretesForaEl.textContent = formatCurrency(icmsFretesForaValor);
        beneficioFiscalEl.textContent = formatCurrency(beneficioFiscal);
        percentualFaturamentoEl.textContent = formatPercentage(percentualSobreFaturamento);
        
        // Cálculos detalhados por CFOP
        const frete5932 = faturamento5932 * (percentualFreteFora / 100);
        const frete6932 = faturamento6932 * (percentualFreteFora / 100);
        const icms5932 = frete5932 * (percentualIcms / 100);
        const icms6932 = frete6932 * (percentualIcms / 100);
        
        // Atualizar tabela detalhada
        cfop5932FatEl.textContent = formatCurrency(faturamento5932);
        cfop5932PercEl.textContent = formatPercentage(percentualFreteFora);
        cfop5932FreteEl.textContent = formatCurrency(frete5932);
        cfop5932IcmsEl.textContent = formatCurrency(icms5932);
        
        cfop6932FatEl.textContent = formatCurrency(faturamento6932);
        cfop6932PercEl.textContent = formatPercentage(percentualFreteFora);
        cfop6932FreteEl.textContent = formatCurrency(frete6932);
        cfop6932IcmsEl.textContent = formatCurrency(icms6932);
        
        // Atualizar campo de valor total dos fretes se estava vazio
        if (valorFreteTotal === 0 && fretesTotais > 0) {
            document.getElementById('valor-frete-total').value = fretesTotais.toFixed(2);
        }
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    document.getElementById('faturamento-5932').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('faturamento-6932').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('percentual-frete-fora').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    document.getElementById('percentual-icms').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    document.getElementById('valor-frete-total').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    // Função para gerar relatório
    window.gerarRelatorio = function() {
        const faturamento5932 = parseFloat(document.getElementById('faturamento-5932').value) || 0;
        const faturamento6932 = parseFloat(document.getElementById('faturamento-6932').value) || 0;
        const percentualFreteFora = parseFloat(document.getElementById('percentual-frete-fora').value) || 0;
        const percentualIcms = parseFloat(document.getElementById('percentual-icms').value) || 0;
        const estadoOrigem = document.getElementById('estado-origem').value;
        const estadoDestino = document.getElementById('estado-destino').value;
        const periodo = document.getElementById('periodo-analise').value;
        
        const faturamentoTotal = faturamento5932 + faturamento6932;
        const fretesTotais = parseFloat(document.getElementById('valor-frete-total').value) || (faturamentoTotal * (percentualFreteFora / 100));
        const fretesForaValor = fretesTotais * (percentualFreteFora / 100);
        const icmsFretesForaValor = fretesForaValor * (percentualIcms / 100);
        
        const relatorio = `
RELATÓRIO DE FRETES INICIADOS FORA DO ESTADO
Data: ${new Date().toLocaleDateString('pt-BR')}
Período: ${periodo}

DADOS GERAIS:
- Estado de Origem: ${estadoOrigem || 'Não informado'}
- Estado de Destino: ${estadoDestino || 'Não informado'}
- Percentual de Frete Fora: ${percentualFreteFora.toFixed(3)}%
- Percentual Médio ICMS: ${percentualIcms.toFixed(2)}%

FATURAMENTO:
- CFOP 5932: ${formatCurrency(faturamento5932)}
- CFOP 6932: ${formatCurrency(faturamento6932)}
- Total: ${formatCurrency(faturamentoTotal)}

FRETES:
- Fretes Totais: ${formatCurrency(fretesTotais)}
- Fretes Fora do Estado: ${formatCurrency(fretesForaValor)}
- ICMS sobre Fretes Fora: ${formatCurrency(icmsFretesForaValor)}

BENEFÍCIO FISCAL:
- Economia com ICMS: ${formatCurrency(icmsFretesForaValor)}
- Percentual sobre Faturamento: ${(fretesForaValor / faturamentoTotal * 100).toFixed(3)}%
        `;
        
        const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-fretes-fora-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Função para salvar dados
    window.salvarDados = function() {
        const dados = {
            data: new Date().toLocaleDateString('pt-BR'),
            faturamento5932: parseFloat(document.getElementById('faturamento-5932').value) || 0,
            faturamento6932: parseFloat(document.getElementById('faturamento-6932').value) || 0,
            percentualFreteFora: parseFloat(document.getElementById('percentual-frete-fora').value) || 0,
            percentualIcms: parseFloat(document.getElementById('percentual-icms').value) || 0,
            valorFreteTotal: parseFloat(document.getElementById('valor-frete-total').value) || 0,
            estadoOrigem: document.getElementById('estado-origem').value,
            estadoDestino: document.getElementById('estado-destino').value,
            periodo: document.getElementById('periodo-analise').value,
            resultados: {
                faturamentoTotal: parseFloat(faturamentoTotalEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                fretesTotais: parseFloat(fretesTotaisEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                fretesForaValor: parseFloat(fretesForaValorEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                icmsFretesForaValor: parseFloat(icmsFretesForaEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                beneficioFiscal: parseFloat(beneficioFiscalEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0
            }
        };
        
        localStorage.setItem('dados-fretes-fora', JSON.stringify(dados));
        alert('Dados salvos com sucesso!');
    };
    
    // Função para carregar dados salvos
    window.carregarDados = function() {
        const dadosSalvos = localStorage.getItem('dados-fretes-fora');
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            
            document.getElementById('faturamento-5932').value = dados.faturamento5932 || '';
            document.getElementById('faturamento-6932').value = dados.faturamento6932 || '';
            document.getElementById('percentual-frete-fora').value = dados.percentualFreteFora || '';
            document.getElementById('percentual-icms').value = dados.percentualIcms || '';
            document.getElementById('valor-frete-total').value = dados.valorFreteTotal || '';
            document.getElementById('estado-origem').value = dados.estadoOrigem || '';
            document.getElementById('estado-destino').value = dados.estadoDestino || '';
            document.getElementById('periodo-analise').value = dados.periodo || 'anual';
            
            calcular();
            alert('Dados carregados com sucesso!');
        } else {
            alert('Nenhum dado salvo encontrado.');
        }
    };
    
    // Adicionar botões de ação se não existirem
    if (!document.getElementById('acoes-fretes')) {
        const acoesDiv = document.createElement('div');
        acoesDiv.id = 'acoes-fretes';
        acoesDiv.className = 'text-center mt-2';
        acoesDiv.innerHTML = `
            <button onclick="salvarDados()" class="btn">Salvar Dados</button>
            <button onclick="carregarDados()" class="btn" style="margin-left: 1rem;">Carregar Dados</button>
            <button onclick="gerarRelatorio()" class="btn" style="margin-left: 1rem;">Gerar Relatório</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(acoesDiv);
        }
    }
    
    // Carregar dados automaticamente se existirem
    const dadosExistentes = localStorage.getItem('dados-fretes-fora');
    if (dadosExistentes) {
        const dados = JSON.parse(dadosExistentes);
        // Preencher apenas se os campos estiverem vazios
        if (!document.getElementById('faturamento-5932').value && dados.faturamento5932) {
            document.getElementById('faturamento-5932').value = dados.faturamento5932;
        }
        if (!document.getElementById('faturamento-6932').value && dados.faturamento6932) {
            document.getElementById('faturamento-6932').value = dados.faturamento6932;
        }
        if (!document.getElementById('percentual-frete-fora').value && dados.percentualFreteFora) {
            document.getElementById('percentual-frete-fora').value = dados.percentualFreteFora;
        }
        if (!document.getElementById('percentual-icms').value && dados.percentualIcms) {
            document.getElementById('percentual-icms').value = dados.percentualIcms;
        }
        
        // Recalcular após carregar
        setTimeout(calcular, 100);
    }
});

