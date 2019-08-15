let dayMap = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 'Sat': 6};
let revDayMap = Object.entries(dayMap).reduce((acc, [k,v])=>Object.assign({}, acc, {[v]:k}), {})
document.querySelector('#copyright-year').innerHTML = (new Date()).getFullYear()
fetch('assets/syllabus.json').then(resp=>resp.json()).then(course=>{
    console.log('course', course);
    let container = document.querySelector('.schedule');

    let days = course.info.days.split('/');

    let delta = dayMap[days[1]] - dayMap[days[0]];
    let startDay = new Date(Date.parse(course.info.start_date));
    console.log('start date', startDay);
    let toggle = true;
    course.schedule.forEach((classDay,i)=>{
        let move = i%2? (7*(i-1)/2+delta):7*i/2;
        let curDay = new Date(startDay.valueOf());
        console.log('start date', curDay, move);
        curDay.setDate(startDay.getDate() + move);
        let child = renderDaySchedule(classDay, curDay);
        container.appendChild(child);

    });
});

function renderDaySchedule(d, curDay){
    let div = document.createElement('div');
    div.classList.add('class');
    div.innerHTML =  `
        <div class="header">
            <span class="date">${revDayMap[curDay.getDay()]}, ${curDay.getMonth()+1}/${curDay.getDate()}</span>
            <strong>${d.is_lab? '⚒':'📖'} ${d.title}</strong>
        </div>
        <div class="content">
            <p class="desc">${d.desc}</p>
        </div>
        `;
    return div;
}