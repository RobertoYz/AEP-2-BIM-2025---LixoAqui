document.addEventListener('DOMContentLoaded', () =>{

    const form = document.getElementById('form-cadastro');
    const coletasContainer = document.getElementById('coletas-container');
    const btnAddColeta = document.getElementById('btn-adicionar-coleta');
    const mensagemCadastro = document.getElementById('mensagem-cadastro');
    const API_URL = 'http://localhost:8080/api/bairros';

    const criarItemColeta = () =>{
        const div = document.createElement('div');
        div.classList.add('coleta-item');

        div.innerHTML = `
            <select name="diaSemana" required>
                <option value="" disabled selected>Selecione o dia</option>
                <option value="Segunda-feira">Segunda-feira</option>
                <option value="Terça-feira">Terça-feira</option>
                <option value="Quarta-feira">Quarta-feira</option>
                <option value="Quinta-feira">Quinta-feira</option>
                <option value="Sexta-feira">Sexta-feira</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
            </select>
            <select name="periodo" required>
                <option value="" disabled selected>Selecione o período</option>
                <option value="Manhã">Manhã (07:00 - 12:00)</option>
                <option value="Tarde">Tarde (13:00 - 18:00)</option>
                <option value="Noite">Noite (19:00 - 23:00)</option>
            </select>
            <button type="button" class="btn-acoes btn-deletar">X</button>
        `;
        coletasContainer.appendChild(div);
        
        div.querySelector('.btn-deletar').addEventListener('click', () =>{
            div.remove();
        });
    };

    btnAddColeta.addEventListener('click', criarItemColeta);
    
    criarItemColeta(); 

    form.addEventListener('submit', async (event) =>{
        event.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const coletas = [];
        const itensColeta = coletasContainer.querySelectorAll('.coleta-item');
        
        if (itensColeta.length === 0){
            alert('Adicione pelo menos um agendamento de coleta.');
            return;
        }

        itensColeta.forEach(item =>{
            const diaSemana = item.querySelector('[name="diaSemana"]').value;
            const periodo = item.querySelector('[name="periodo"]').value;
            if (diaSemana && periodo){
                coletas.push({ diaSemana, periodo });
            }
        });

        if (coletas.length !== itensColeta.length){
            alert('Preencha todos os campos de dia e período.');
            return;
        }

        const dadosBairro = { nome, coletas };

        try{
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosBairro)
            });

            if (response.ok){
                mensagemCadastro.textContent = `Bairro "${nome}" cadastrado com sucesso!`;
                mensagemCadastro.style.color = 'var(--primary-color)';
                form.reset(); 
                coletasContainer.innerHTML = ''; 
                criarItemColeta(); 
            } else{
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao cadastrar. Tente novamente.');
            }

        } catch (error){
            console.error('Falha no cadastro:', error);
            mensagemCadastro.textContent = error.message;
            mensagemCadastro.style.color = 'var(--danger-color)';
        }

        setTimeout(() =>{
            mensagemCadastro.textContent = '';
        }, 5000);
    });
});