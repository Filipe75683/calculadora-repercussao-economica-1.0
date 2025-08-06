// JavaScript para cálculo de Destrava
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('destrava-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const saldoTotalEl = document.getElementById('saldo-total');
    const valorDestravaEl = document.getElementById('valor-destrava');
    const valorBloqueadoRestanteEl = document.getElementById('valor-bloqueado-restante');
    const percentualLiberacaoEl = document.getElementById('percentual-liberacao');
    const impactoMensalEl = document.getElementById('impacto-mensal');
    
    // Elementos da tabela detalhada
    const cfopDetalheEl = document.getElementById('cfop-detalhe');
    const cfopDescricaoEl = document.getElementById('cfop-descricao');
    const cfopSaldoEl = document.getElementById('cfop-saldo');
    const cfopPercentualEl = document.getElementById('cfop-percentual');
    const cfopLiberadoEl = document.getElementById('cfop-liberado');
    const cfopStatusEl = document.getElementById('cfop-status');
    
    // Botões
    const gerarCronogramaBtn = document.getElementById('gerar-cronograma');
    const simularDestravaBtn = document.getElementById('simular-destrava');
    
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
        const conta = parseInt(document.getElementById('conta').value) || 0;
        const cfop = parseInt(document.getElementById('cfop').value) || 0;
        const saldoBloqueado = parseFloat(document.getElementById('saldo-bloqueado').value) || 0;
        const percentualDestrava = parseFloat(document.getElementById('percentual-destrava').value) || 100;
        const tipoOperacao = document.getElementById('tipo-operacao').value;
        
        if (saldoBloqueado === 0) {
            limparResultados();
            return;
        }
        
        // Cálculos
        const valorDestrava = saldoBloqueado * (percentualDestrava / 100);
        const valorBloqueadoRestante = saldoBloqueado - valorDestrava;
        const percentualLiberacao = percentualDestrava;
        
        // Impacto financeiro mensal (estimativa baseada em juros de oportunidade)
        const taxaJurosOportunidade = 0.01; // 1% ao mês
        const impactoMensal = valorDestrava * taxaJurosOportunidade;
        
        // Atualizar resultados principais
        saldoTotalEl.textContent = formatCurrency(saldoBloqueado);
        valorDestravaEl.textContent = formatCurrency(valorDestrava);
        valorBloqueadoRestanteEl.textContent = formatCurrency(valorBloqueadoRestante);
        percentualLiberacaoEl.textContent = formatPercentage(percentualLiberacao);
        impactoMensalEl.textContent = formatCurrency(impactoMensal);
        
        // Atualizar tabela detalhada
        cfopDetalheEl.textContent = cfop || '-';
        cfopDescricaoEl.textContent = obterDescricaoCfop(cfop);
        cfopSaldoEl.textContent = formatCurrency(saldoBloqueado);
        cfopPercentualEl.textContent = formatPercentage(percentualDestrava);
        cfopLiberadoEl.textContent = formatCurrency(valorDestrava);
        cfopStatusEl.textContent = valorDestrava > 0 ? 'Liberável' : 'Bloqueado';
    }
    
    // Função para obter descrição do CFOP
    function obterDescricaoCfop(cfop) {
        const descricoes = {
            7101: 'Venda de produção do estabelecimento',
            7102: 'Venda de mercadoria adquirida ou recebida de terceiros',
            7949: 'Outra saída de mercadoria ou prestação de serviço não especificado',
            1101: 'Compra para industrialização',
            1102: 'Compra para comercialização',
            2101: 'Compra para industrialização de outro estado',
            2102: 'Compra para comercialização de outro estado'
        };
        
        return descricoes[cfop] || 'Descrição não encontrada';
    }
    
    // Função para limpar resultados
    function limparResultados() {
        saldoTotalEl.textContent = formatCurrency(0);
        valorDestravaEl.textContent = formatCurrency(0);
        valorBloqueadoRestanteEl.textContent = formatCurrency(0);
        percentualLiberacaoEl.textContent = formatPercentage(0);
        impactoMensalEl.textContent = formatCurrency(0);
        
        cfopDetalheEl.textContent = '-';
        cfopDescricaoEl.textContent = '-';
        cfopSaldoEl.textContent = formatCurrency(0);
        cfopPercentualEl.textContent = formatPercentage(0);
        cfopLiberadoEl.textContent = formatCurrency(0);
        cfopStatusEl.textContent = 'Pendente';
    }
    
    // Função para gerar cronograma
    function gerarCronograma() {
        const saldoBloqueado = parseFloat(document.getElementById('saldo-bloqueado').value) || 0;
        const percentualDestrava = parseFloat(document.getElementById('percentual-destrava').value) || 100;
        
        if (saldoBloqueado === 0) {
            alert('Por favor, informe o saldo bloqueado para gerar o cronograma.');
            return;
        }
        
        const valorDestrava = saldoBloqueado * (percentualDestrava / 100);
        const cronogramaTable = document.getElementById('cronograma-table').getElementsByTagName('tbody')[0];
        
        // Limpar tabela
        cronogramaTable.innerHTML = '';
        
        // Simular cronograma de 6 meses
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
        const valorMensal = valorDestrava / 6;
        let valorAcumulado = 0;
        let saldoRestante = saldoBloqueado;
        
        meses.forEach((mes, index) => {
            valorAcumulado += valorMensal;
            saldoRestante -= valorMensal;
            
            const row = cronogramaTable.insertRow();
            row.innerHTML = `
                <td>${mes}</td>
                <td>${formatCurrency(valorMensal)}</td>
                <td>${formatCurrency(valorAcumulado)}</td>
                <td>${formatCurrency(Math.max(0, saldoRestante))}</td>
                <td>
                    <button class="btn" style="background: #27ae60; padding: 0.3rem 0.8rem; font-size: 0.8rem;">
                        Processar
                    </button>
                </td>
            `;
        });
        
        alert('Cronograma gerado com sucesso!');
    }
    
    // Função para simular destrava
    function simularDestrava() {
        const saldoBloqueado = parseFloat(document.getElementById('saldo-bloqueado').value) || 0;
        const percentualDestrava = parseFloat(document.getElementById('percentual-destrava').value) || 100;
        const tipoOperacao = document.getElementById('tipo-operacao').value;
        const motivoBloqueio = document.getElementById('motivo-bloqueio').value;
        
        if (saldoBloqueado === 0) {
            alert('Por favor, informe o saldo bloqueado para simular.');
            return;
        }
        
        const valorDestrava = saldoBloqueado * (percentualDestrava / 100);
        const prazoEstimado = obterPrazoEstimado(motivoBloqueio);
        const probabilidadeSuccesso = obterProbabilidadeSuccesso(tipoOperacao, motivoBloqueio);
        
        const simulacao = `
SIMULAÇÃO DE DESTRAVA
=====================

Saldo Bloqueado: ${formatCurrency(saldoBloqueado)}
Valor a Destravar: ${formatCurrency(valorDestrava)}
Tipo de Operação: ${tipoOperacao}
Motivo do Bloqueio: ${motivoBloqueio}

ESTIMATIVAS:
- Prazo Estimado: ${prazoEstimado}
- Probabilidade de Sucesso: ${probabilidadeSuccesso}%
- Custo Estimado: ${formatCurrency(valorDestrava * 0.05)} (5% do valor)

PRÓXIMOS PASSOS:
1. Reunir documentação comprobatória
2. Protocolar pedido administrativo
3. Acompanhar andamento do processo
4. Considerar medida judicial se necessário

OBSERVAÇÃO: Esta é uma simulação baseada em dados históricos.
Recomenda-se consultar um advogado especializado.
        `;
        
        alert(simulacao);
    }
    
    // Função para obter prazo estimado
    function obterPrazoEstimado(motivo) {
        const prazos = {
            'auditoria': '60-90 dias',
            'inconsistencia': '30-45 dias',
            'prazo-vencido': '15-30 dias',
            'pendencia-legal': '90-180 dias',
            'outros': '45-60 dias'
        };
        
        return prazos[motivo] || '30-60 dias';
    }
    
    // Função para obter probabilidade de sucesso
    function obterProbabilidadeSuccesso(tipo, motivo) {
        let base = 70; // Base de 70%
        
        // Ajustes por tipo
        if (tipo === 'credito-icms') base += 10;
        if (tipo === 'credito-pis-cofins') base += 5;
        
        // Ajustes por motivo
        if (motivo === 'inconsistencia') base -= 20;
        if (motivo === 'auditoria') base -= 10;
        if (motivo === 'prazo-vencido') base += 15;
        
        return Math.min(95, Math.max(30, base));
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    gerarCronogramaBtn.addEventListener('click', gerarCronograma);
    simularDestravaBtn.addEventListener('click', simularDestrava);
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    document.getElementById('saldo-bloqueado').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('percentual-destrava').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
});

