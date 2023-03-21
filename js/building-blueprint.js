
let activeInstrument;

document.addEventListener('DOMContentLoaded', event => {
    document.getElementById('generate-canvas').addEventListener('click', event => {
        const { target } = event;
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '';
        const sx = target.closest('.block').querySelector('.sx').value || 0;
        const sy = target.closest('.block').querySelector('.sy').value || 0;
        for (let y = sy-1; y >= 0; y--) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let x = 0; x < sx; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-x', x);
                cell.setAttribute('data-y', y);
                cell.setAttribute('data-construction', '{}');
                cell.setAttribute('data-surface', '{}')
                cell.setAttribute('data-rotation', 0);
                row.appendChild(cell);
            }
            canvas.appendChild(row);
        }
    });

    const instruments = document.getElementById('instruments');
    instrumentsData.forEach(category => {
        const categoryBlock = document.createElement('div');
        categoryBlock.classList.add('category');
        const categoryLabel = document.createElement('div');
        categoryLabel.classList.add('label');
        categoryLabel.innerHTML = category.t;
        categoryBlock.appendChild(categoryLabel);
        const categoryList = document.createElement('div');
        categoryList.classList.add('list');

        category.l.forEach(inst => {
            const btn = document.createElement('button');
            btn.classList.add('generic');
            btn.innerHTML = inst.t;
            btn.setAttribute('data-construction', JSON.stringify(inst));

            categoryList.appendChild(btn);
        })
        categoryBlock.appendChild(categoryList);
        instruments.appendChild(categoryBlock);
    });

    document.querySelectorAll('.generic').forEach(generic => {
        generic.addEventListener('click', event => {
            activeInstrument = JSON.parse(event.target.getAttribute('data-construction'));
        });
    });

    document.getElementById('canvas').addEventListener('click', event => {
        const { target } = event;
        if (target.classList && target.classList.contains('cell')){
            const currentInstrument = JSON.parse(target.getAttribute('data-construction'));
            let currentRotation = +target.getAttribute('data-rotation');
            let rotatable = +target.getAttribute('data-rotatable');
            console.log(rotatable);
            if (currentInstrument.e == activeInstrument.e && currentInstrument.r){
                currentRotation += 90;
                if (currentRotation === 360) {
                    currentRotation = 0;
                }
                target.setAttribute('data-rotation', currentRotation);
            } else {
                target.setAttribute('data-rotation', 0);
                if (activeInstrument.e == 0) {
                    target.setAttribute('data-surface', JSON.stringify({}));
                    target.setAttribute('data-construction', JSON.stringify({}));
                }else if (activeInstrument.s){
                    target.setAttribute('data-surface', JSON.stringify(activeInstrument));
                }else{
                    target.setAttribute('data-construction', JSON.stringify(activeInstrument));
                }
            }
            renderBluePrint(target);
        }
        
    });
});

function renderBluePrint(cell){
    const construction = JSON.parse(cell.getAttribute('data-construction'));
    console.log(construction);
    const surface = JSON.parse(cell.getAttribute('data-surface'));
    const rotation = cell.getAttribute('data-rotation');
    cell.innerHTML = '';
    const entity = construction.e || surface.e || '';
    const c = construction.c || surface.c || '';
    const bgc = construction.bgc || surface.bgc || '';
    cell.style = '';
    cell.style.transform = `rotate(${rotation}deg)`;
    if (entity != 0) cell.innerHTML = '&#'+entity;
    if (c) cell.style.color = '#'+c;
    if (bgc) cell.style.backgroundColor = '#'+bgc;
}