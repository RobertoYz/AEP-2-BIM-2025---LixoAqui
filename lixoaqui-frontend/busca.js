document.addEventListener('DOMContentLoaded', () =>{

    const btnBuscar = document.getElementById('btnBuscar');
    const inputBairro = document.getElementById('nomeBairro');
    const corpoTabela = document.getElementById('corpo-tabela');
    const mensagemBusca = document.getElementById('mensagem-busca');
    const API_URL = 'http://localhost:8080/api/bairros';

    /**
     *
     * @param {Array} bairros
     */
    const renderizarTabela = (bairros) =>{ 

        corpoTabela.innerHTML = '';
        mensagemBusca.textContent = '';

        if (bairros.length === 0){
            mensagemBusca.textContent = 'Nenhum bairro encontrado com esse nome.';
            return;
        }

        bairros.forEach(bairro =>{
            const tr = document.createElement('tr');
            const coletasHtml = bairro.coletas.length > 0
                ? `<ul class="coletas-lista">${bairro.coletas.map(c => `<li><strong>${c.diaSemana}:</strong> ${c.periodo}</li>`).join('')}</ul>`
                : 'Nenhuma coleta cadastrada';

            tr.innerHTML = `
                <td>${bairro.nome}</td>
                <td>${coletasHtml}</td>
            `;
            corpoTabela.appendChild(tr);
        });
    };

    const buscarBairros = async () =>{
        const nome = inputBairro.value.trim();
        if (!nome){
            alert('Digite o nome de um bairro para iniciar a busca.');
            return;
        }

        try{
            const response = await fetch(`${API_URL}/buscar?nome=${encodeURIComponent(nome)}`);
            if (!response.ok){
                throw new Error('Erro ao buscar dados da API.');
            }
            const bairros = await response.json();
            renderizarTabela(bairros);
        }catch (error){
            mensagemBusca.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
            console.error('Falha na busca:', error);
        }
    };

    btnBuscar.addEventListener('click', buscarBairros);

    inputBairro.addEventListener('keypress', (event) =>{
        if (event.key === 'Enter'){
            buscarBairros();
        }
    });
});