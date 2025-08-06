// JavaScript para cálculo de Crédito ICMS Combustível
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('icms-combustivel-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const baseIcmsEl = document.getElementById('base-icms');
    const icmsDestacadoEl = document.getElementById('icms-destacado');
    const creditoPermitidoEl = document.getElementById('credito-permitido');
    const valorLitroEl = document.getElementById('valor-litro');
    const totalPeriodoEl = document.getElementById('total-periodo');
    
    // Tabela de CFOPs
    const cfopTable = document.getElementById('cfop-table').getElementsByTagName('tbody')[0];
    const adicionarCfopBtn = document.getElementById('adicionar-cfop');
    const calcularTotalBtn = document.getElementById('calcular-total');
    const limparCfopsBtn = document.getElementById('limpar-cfops');
    
    // Array para armazenar CFOPs
    let cfops = JSON.parse(localStorage.getItem('cfops-combustivel') || '[]');
    
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
        const valorCombustivel = parseFloat(document.getElementById('valor-combustivel').value) || 0;
        const aliquotaIcms = parseFloat(document.getElementById('aliquota-icms').value) || 0;
        const quantidadeLitros = parseFloat(document.getElementById('quantidade-litros').value) || 0;
        const periodoMeses = parseInt(document.getElementById('periodo-meses').value) || 12;
        const percentualCredito = parseFloat(document.getElementById('percentual-credito').value) || 100;
        
        if (valorCombustivel === 0 || aliquotaIcms === 0) {
            // Limpar resultados se não há dados suficientes
            baseIcmsEl.textContent = formatCurrency(0);
            icmsDestacadoEl.textContent = formatCurrency(0);
            creditoPermitidoEl.textContent = formatCurrency(0);
            valorLitroEl.textContent = formatCurrency(0);
            totalPeriodoEl.textContent = formatCurrency(0);
            return;
        }
        
        // Cálculos
        const baseIcms = valorCombustivel / (1 + (aliquotaIcms / 100)); // Base sem ICMS
        const icmsDestacado = valorCombustivel - baseIcms;
        const creditoPermitido = icmsDestacado * (percentualCredito / 100);
        const valorLitro = quantidadeLitros > 0 ? valorCombustivel / quantidadeLitros : 0;
        const totalPeriodo = creditoPermitido * periodoMeses;
        
        // Atualizar resultados
        baseIcmsEl.textContent = formatCurrency(baseIcms);
        icmsDestacadoEl.textContent = formatCurrency(icmsDestacado);
        creditoPermitidoEl.textContent = formatCurrency(creditoPermitido);
        valorLitroEl.textContent = formatCurrency(valorLitro);
        totalPeriodoEl.textContent = formatCurrency(totalPeriodo);
    }
    
    // Função para adicionar CFOP
    function adicionarCfop() {
        const cfop = document.getElementById('cfop').value;
        const valorCombustivel = parseFloat(document.getElementById('valor-combustivel').value) || 0;
        const aliquotaIcms = parseFloat(document.getElementById('aliquota-icms').value) || 0;
        const tipoCombustivel = document.getElementById('tipo-combustivel').value;
        
        if (!cfop || valorCombustivel === 0 || aliquotaIcms === 0 || !tipoCombustivel) {
            alert('Por favor, preencha todos os campos obrigatórios antes de adicionar o CFOP.');
            return;
        }
        
        const baseIcms = valorCombustivel / (1 + (aliquotaIcms / 100));
        const icmsDestacado = valorCombustivel - baseIcms;
        const percentualCredito = parseFloat(document.getElementById('percentual-credito').value) || 100;
        const creditoPermitido = icmsDestacado * (percentualCredito / 100);
        
        const cfopDescricoes = {
            '1653': 'Aquisição de combustível para consumo',
            '2653': 'Aquisição de combustível de outro estado',
            '1658': 'Transferência de combustível',
            '2658': 'Transferência de combustível de outro estado'
        };
        
        const novoCfop = {
            cfop: cfop,
            descricao: cfopDescricoes[cfop] || 'Descrição não encontrada',
            valor: valorCombustivel,
            icms: icmsDestacado,
            credito: creditoPermitido,
            tipoCombustivel: tipoCombustivel,
            aliquota: aliquotaIcms,
            data: new Date().toLocaleDateString('pt-BR')
        };
        
        cfops.push(novoCfop);
        localStorage.setItem('cfops-combustivel', JSON.stringify(cfops));
        atualizarTabelaCfops();
        
        alert('CFOP adicionado com sucesso!');
    }
    
    // Função para atualizar tabela de CFOPs
    function atualizarTabelaCfops() {
        cfopTable.innerHTML = '';
        
        cfops.forEach((item, index) => {
            const row = cfopTable.insertRow();
            row.innerHTML = `
                <td>${item.cfop}</td>
                <td>${item.descricao}</td>
                <td>${formatCurrency(item.valor)}</td>
                <td>${formatCurrency(item.icms)}</td>
                <td>${formatCurrency(item.credito)}</td>
                <td>
                    <button onclick="removerCfop(${index})" class="btn" style="background: #e74c3c; padding: 0.3rem 0.8rem; font-size: 0.8rem;">
                        Remover
                    </button>
                </td>
            `;
        });
    }
    
    // Função para remover CFOP
    window.removerCfop = function(index) {
        if (confirm('Tem certeza que deseja remover este CFOP?')) {
            cfops.splice(index, 1);
            localStorage.setItem('cfops-combustivel', JSON.stringify(cfops));
            atualizarTabelaCfops();
        }
    };
    
    // Função para calcular total
    function calcularTotal() {
        if (cfops.length === 0) {
            alert('Adicione pelo menos um CFOP para calcular o total.');
            return;
        }
        
        const totalValor = cfops.reduce((sum, item) => sum + item.valor, 0);
        const totalIcms = cfops.reduce((sum, item) => sum + item.icms, 0);
        const totalCredito = cfops.reduce((sum, item) => sum + item.credito, 0);
        const periodoMeses = parseInt(document.getElementById('periodo-meses').value) || 12;
        const totalPeriodo60Meses = totalCredito * 60; // Conforme planilha original
        
        alert(`Resumo dos Totais:
        
Total de Valores: ${formatCurrency(totalValor)}
Total de ICMS: ${formatCurrency(totalIcms)}
Total de Créditos: ${formatCurrency(totalCredito)}
Total para 60 meses: ${formatCurrency(totalPeriodo60Meses)}`);
        
        // Atualizar o campo de total do período
        totalPeriodoEl.textContent = formatCurrency(totalPeriodo60Meses);
    }
    
    // Função para limpar CFOPs
    function limparCfops() {
        if (confirm('Tem certeza que deseja limpar todos os CFOPs? Esta ação não pode ser desfeita.')) {
            cfops = [];
            localStorage.removeItem('cfops-combustivel');
            atualizarTabelaCfops();
            alert('Lista de CFOPs limpa com sucesso!');
        }
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    adicionarCfopBtn.addEventListener('click', adicionarCfop);
    calcularTotalBtn.addEventListener('click', calcularTotal);
    limparCfopsBtn.addEventListener('click', limparCfops);
    
    // Carregar CFOPs ao inicializar
    atualizarTabelaCfops();
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    document.getElementById('valor-combustivel').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('aliquota-icms').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    document.getElementById('quantidade-litros').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('percentual-credito').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    document.getElementById('periodo-meses').addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 60) this.value = 60;
    });
    
    // Função para exportar dados
    window.exportarCfops = function() {
        if (cfops.length === 0) {
            alert('Não há dados para exportar.');
            return;
        }
        
        const dados = {
            data: new Date().toLocaleDateString('pt-BR'),
            cfops: cfops,
            totais: {
                valor: cfops.reduce((sum, item) => sum + item.valor, 0),
                icms: cfops.reduce((sum, item) => sum + item.icms, 0),
                credito: cfops.reduce((sum, item) => sum + item.credito, 0)
            }
        };
        
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `icms-combustivel-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Adicionar botão de exportar
    if (!document.getElementById('exportar-cfops-btn')) {
        const exportarBtn = document.createElement('button');
        exportarBtn.id = 'exportar-cfops-btn';
        exportarBtn.className = 'btn';
        exportarBtn.textContent = 'Exportar Dados';
        exportarBtn.style.marginLeft = '1rem';
        exportarBtn.onclick = window.exportarCfops;
        
        calcularTotalBtn.parentNode.appendChild(exportarBtn);
    }
});

