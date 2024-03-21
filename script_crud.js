    const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
    const formAdicionarTarefa = document.querySelector('.app__form-add-task')
    const textArea = document.querySelector('.app__form-textarea')
    const ulTarefas = document.querySelector('.app__section-task-list')
    const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
    const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

    const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
    const btnRemoverTodas = document.querySelector('#btn-remover-todas')
    
    // se o JSON.parse não encontrar nada no armazenamento interno do navegador, ele retorna um array vazio
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
    let tarefaSelecionada = null
    let liTarefaSelecionada = null

    const limparFormulario = () => {
        textArea.value = ''
        formAdicionarTarefa.classList.add('hidden')

    }
    btnCancelar.addEventListener('click', limparFormulario)

    function atualizarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas))
    }

    function criarElementoTarefa(tarefa) {
        const li = document.createElement('li')
        li.classList.add('app__section-task-list-item')

        const svg = document.createElement('svg')
        svg.innerHTML =  `
            <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>
        `

        const p = document.createElement('p')
        p.textContent = tarefa.descricao
        p.classList.add('app__section-task-list-item-description')

        const botao = document.createElement('button')
        botao.classList.add('app_button-edit')

        botao.onclick = () => {
            //debugger
            const novaDescricao = prompt("Qual é o novo nome da tarefa?", tarefa.descricao)
            //console.log('Nova descrição da tarefa: ', novaDescricao)
            if (novaDescricao) {
                p.textContent = novaDescricao //atualizamos o que está na tela
                tarefa.descricao = novaDescricao //atualizamos o que está no array (nos dados)
                atualizarTarefas() //atualizamos o que está no armazenamento interno do navegador
            }
        }

        const imagemBotao = document.createElement('img')
        imagemBotao.src = './imagens/edit.png'
        botao.append(imagemBotao)

        li.append(svg, p, botao)

        if (tarefa.completa) {
            li.classList.add('app__section-task-list-item-complete')
            botao.setAttribute('disabled', true)
        } else {
            li.onclick = () => {
                //debugger
                document.querySelectorAll('.app__section-task-list-item-active')
                    .forEach(elemento => {
                        elemento.classList.remove('app__section-task-list-item-active')
                    })
                if (tarefaSelecionada == tarefa) {
                    paragrafoDescricaoTarefa.textContent = ''
                    tarefaSelecionada = null
                    liTarefaSelecionada = null
                    return
                }
                tarefaSelecionada = tarefa
                liTarefaSelecionada = li
                paragrafoDescricaoTarefa.textContent = tarefa.descricao
                li.classList.add('app__section-task-list-item-active')
            }
        }
        return li
    }

    btnAdicionarTarefa.addEventListener('click', () => {
        formAdicionarTarefa.classList.toggle('hidden')
    })

    formAdicionarTarefa.addEventListener('submit', (evento) => {
        evento.preventDefault();  // faz o "refresh" automático da página ficar desativado
        const tarefa = {
            descricao: textArea.value
        }
        tarefas.push(tarefa)
        const elementoTarefa = criarElementoTarefa(tarefa)
        ulTarefas.append(elementoTarefa)
        // guardando as tarefas no armazenamento interno do navegador; transforma o array de objetos (tarefas) em uma string
        atualizarTarefas()
        textArea.value = ''
        formAdicionarTarefa.classList.add('hidden')
    })

    textArea.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault(); // Evita que a tecla Enter faça uma quebra de linha no textarea
            formAdicionarTarefa.dispatchEvent(new Event('submit')); // Dispara o evento de submit do formulário
        }
    });
    
    tarefas.forEach(tarefa => {
        const elementoTarefa = criarElementoTarefa(tarefa)
        ulTarefas.append(elementoTarefa)
    })

    document.addEventListener('FocoFinalizado', () => {
        if (tarefaSelecionada && liTarefaSelecionada) {
            liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
            liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
            liTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
            tarefaSelecionada.completa = true
            atualizarTarefas()
        }
    })

    const removerTarefas = (somenteCompletas) => {
        // se for somenteCompletas, então remove somente as tarefas completas, se não, remove todas as tarefas
        const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
        document.querySelectorAll(seletor).forEach(elemento => {
            elemento.remove()
        })
        // se for somenteCompletas, ocorre o filtro, se não, retorna um array vazio
        tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
        atualizarTarefas()
    }

    btnRemoverConcluidas.onclick = () => removerTarefas(true)
    btnRemoverTodas.onclick = () => removerTarefas(false)