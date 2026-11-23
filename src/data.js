export const categories = [
 {id:'cement', name:'Цемент и смеси', sub:'Прочная основа любого проекта', icon:'layers', num:'01', color:'#e9ddd0'},
 {id:'bricks', name:'Кирпич и блоки', sub:'Форма будущего здания', icon:'boxes', num:'02', color:'#edc6af'},
 {id:'metal', name:'Металл и арматура', sub:'Прочность в каждой детали', icon:'hardhat', num:'03', color:'#c3ccd0'},
 {id:'tools', name:'Инструменты', sub:'Точность в ваших руках', icon:'wrench', num:'04', color:'#b5d1d4'},
 {id:'finish', name:'Краски и отделка', sub:'Характер вашего интерьера', icon:'paintbrush', num:'05', color:'#ccd4c5'},
 {id:'plumbing', name:'Сантехника и электрика', sub:'Комфорт, который остаётся', icon:'zap', num:'06', color:'#cad1d7'}
]
export const products = [
 { id:'cement-m400', name:'Цемент M400 · 50 кг', category:'cement', type:'Сухие смеси', desc:'Портландцемент · 50 кг', price:62000, oldPrice:68000, unit:'мешок', image:'/assets/cement.png', badge:'ХИТ ПРОДАЖ', stock:true, tag:'Для фундамента', featured:true },
 { id:'bricks-ceramic', name:'Кирпич керамический', category:'bricks', type:'Кирпичи и блоки', desc:'250 × 120 × 65 мм', price:2800, oldPrice:3200, unit:'шт.', image:'/assets/bricks.png', badge:'ПОПУЛЯРНОЕ', stock:true, tag:'Для стен', featured:true },
 { id:'drill-18v', name:'Дрель-шуруповёрт 18V', category:'tools', type:'Электроинструменты', desc:'18 В · 2 АКБ · кейс', price:890000, oldPrice:1050000, unit:'шт.', image:'/assets/drill.png', badge:'ВЫБОР МАСТЕРА', stock:true, tag:'Инструменты', featured:true },
 { id:'paint-interior', name:'Краска интерьерная · 10 л', category:'finish', type:'Отделочные материалы', desc:'Матовая · белая · 10 л', price:235000, unit:'ведро', image:'/assets/paint.png', badge:'НОВИНКА', stock:true, tag:'Для ремонта', featured:true },
 { id:'rebar-12', name:'Арматура стальная Ø12', category:'metal', type:'Металлопрокат', desc:'Рифлёная · 12 мм · 6 м', price:48000, unit:'шт.', image:'/assets/rebar.svg', badge:'ДЛЯ СТРОЙКИ', stock:true, tag:'Для фундамента' },
 { id:'tile-porcelain', name:'Керамогранит Stone', category:'finish', type:'Напольные покрытия', desc:'Матовый · 60 × 60 см', price:168000, unit:'м²', image:'/assets/tile.svg', badge:'КОЛЛЕКЦИЯ', stock:true, tag:'Для ремонта' },
 { id:'pipe-ppr', name:'Труба PPR Ø25 мм', category:'plumbing', type:'Сантехника', desc:'Полипропилен · 4 м', price:24000, unit:'шт.', image:'/assets/pipe.svg', badge:'В НАЛИЧИИ', stock:true, tag:'Для ремонта' },
 { id:'plaster-pro', name:'Штукатурка гипсовая · 30 кг', category:'cement', type:'Сухие смеси', desc:'Для внутренних работ', price:54000, unit:'мешок', image:'/assets/plaster.svg', badge:'ПОПУЛЯРНОЕ', stock:true, tag:'Для ремонта' },
 { id:'insulation', name:'Утеплитель фасадный', category:'finish', type:'Изоляционные материалы', desc:'Плиты · 50 мм', price:87000, unit:'м²', image:'/assets/insulation.svg', badge:'ДЛЯ СТРОЙКИ', stock:true, tag:'Для стройки' }
]
export const money = n => new Intl.NumberFormat('ru-RU').format(n)
export const projects = [
 {title:'Фундамент начинается с качества', type:'ЧАСТНОЕ СТРОИТЕЛЬСТВО', image:'/assets/project-build.png', id:'01'},
 {title:'Пространство, в котором хочется жить', type:'РЕМОНТ И ОТДЕЛКА', image:'/assets/project-renovate.png', id:'02'},
 {title:'Инструмент для точной работы', type:'ОСНАЩЕНИЕ ОБЪЕКТОВ', image:'/assets/project-tools.png', id:'03'}
]
