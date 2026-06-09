import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable (settings, onAction) {
    const { tableTemplate, before, after } = settings;
    const rowTemplate = document.getElementById(settings.rowTemplate);
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    [...before].reverse().forEach(templateId => {
        const block = cloneTemplate(templateId);

        root.container.prepend(block.container);
    });

    [...after].forEach(templateId => {
        const block = cloneTemplate(templateId);

        root.container.append(block.container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });
    
    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        })
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();

        onAction(e.submitter);
    })

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map((item) => {
            const row = rowTemplate.content.cloneNode(true); // создаем глубокую копию содержимого шаблона rowTemplate
            const cells = row.querySelectorAll("[data-name]"); // находим массив всех элементов внутри rowTemplate по дата атрибуту data-name
            
            // проходим по массиву элементов cells (cell это один элемент строки таблицы) <div data-name="seller"></div>
            cells.forEach(cell => {
                cell.textContent = item[cell.dataset.name]; // присваиваем каждому элементу массива содержимое из объекта с данными
            });

            return row; // возвращаем строку
        });
    
        
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}