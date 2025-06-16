document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('bairro-search-input');
    const searchButton = document.getElementById('btn-search-edit');
    const searchMessage = document.getElementById('search-message');
    const editArea = document.getElementById('edit-area');
    const editForm = document.getElementById('form-edit');
    const bairroIdInput = document.getElementById('bairro-id');
    const nomeInput = document.getElementById('nome');
    const coletasContainer = document.getElementById('coletas-container');
    const addColetaButton = document.getElementById('btn-adicionar-coleta');
    const deleteButton = document.getElementById('btn-delete');
    const editMessage = document.getElementById('edit-message');
    const API_URL = 'http://localhost:8080/api/bairros';

    searchButton.addEventListener('click', async () =>{
        const nome = searchInput.value.trim();
        if (!nome){
            alert('Por favor, digite o nome exato do bairro.');
            return;
        }

        editArea.classList.add('esconde');
        searchMessage.textContent = 'Buscando...';

        try{
            const response = await fetch(`${API_URL}/buscar?nome=${encodeURIComponent(nome)}`);
            if (!response.ok) throw new Error("Erro de rede ao buscar.");
            
            const bairros = await response.json();
            const bairroEncontrado = bairros.find(b => b.nome.toLowerCase() === nome.toLowerCase());

            if (bairroEncontrado){
                searchMessage.textContent = '';
                await popularFormulario(bairroEncontrado);
                editArea.classList.remove('esconde');
            } else{
                searchMessage.textContent = 'Nenhum bairro encontrado com este nome exato.';
            }
        } catch (e){
            searchMessage.textContent = 'Erro ao buscar bairro.';
            console.error(e);
        }
    });

    const popularFormulario = (bairro) =>{
        bairroIdInput.value = bairro.id;
        nomeInput.value = bairro.nome;
        coletasContainer.innerHTML = '';
        bairro.coletas.forEach(coleta => criarItemColeta(coleta));
    };

    const criarItemColeta = (coleta = {}) =>{
        const div = document.createElement('div');
        div.classList.add('coleta-item');
        const dias = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
        const periodos = { "Manhã": "Manhã (07:00 - 12:00)", "Tarde": "Tarde (13:00 - 18:00)", "Noite": "Noite (19:00 - 23:00)" };
        const diasOptions = dias.map(dia => `<option value="${dia}" ${coleta.diaSemana === dia ? 'selected' : ''}>${dia}</option>`).join('');
        const periodosOptions = Object.keys(periodos).map(p => `<option value="${p}" ${coleta.periodo === p ? 'selected' : ''}>${periodos[p]}</option>`).join('');
        
        div.innerHTML = `
            <select name="diaSemana" required>${diasOptions}</select>
            <select name="periodo" required>${periodosOptions}</select>
            <button type="button" class="btn-acoes btn-deletar">X</button>
        `;
        coletasContainer.appendChild(div);
        
        div.querySelector('.btn-deletar').addEventListener('click', () => div.remove());
    };
    addColetaButton.addEventListener('click', () => criarItemColeta());

    editForm.addEventListener('submit', async (event) =>{
        event.preventDefault();
        const id = bairroIdInput.value;
        const nome = nomeInput.value.trim();
        const coletas = Array.from(coletasContainer.querySelectorAll('.coleta-item')).map(item =>({
            diaSemana: item.querySelector('[name="diaSemana"]').value,
            periodo: item.querySelector('[name="periodo"]').value
        }));

        try{
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, coletas })
            });
            if (response.ok){
                editMessage.textContent = 'Bairro atualizado com sucesso!';
                editMessage.style.color = 'var(--primary-color)';
            } else{
                const errorText = await response.text();
                throw new Error(errorText || 'Falha ao atualizar.');
            }
        } catch (error){
            editMessage.textContent = error.message;
            editMessage.style.color = 'var(--danger-color)';
        }
        setTimeout(() => editMessage.textContent = '', 5000);
    });

    deleteButton.addEventListener('click', async () =>{
        const id = bairroIdInput.value;
        if (!confirm(`Tem certeza que deseja excluir o bairro "${nomeInput.value}"?`)) return;

        try{
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok){
                alert('Bairro excluído com sucesso!');
                editArea.classList.add('esconde');
                searchInput.value = '';
            } else{
                throw new Error('Falha ao excluir.');
            }
        } catch (error){
            editMessage.textContent = error.message;
            editMessage.style.color = 'var(--danger-color)';
        }
    });
});