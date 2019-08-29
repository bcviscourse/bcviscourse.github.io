let dayMap = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 'Sat': 6};
let revDayMap = Object.entries(dayMap).reduce((acc, [k,v])=>Object.assign({}, acc, {[v]:k}), {})
document.querySelector('#copyright-year').innerHTML = (new Date()).getFullYear()

let syllabus;
fetch('assets/syllabus.json').then(resp=>resp.json()).then(course=>{
    console.log('course', course);
    syllabus = course;
    syllabus.weeks = groupByWeek(syllabus);
    renderSchedule(syllabus.weeks);
    

});
function groupByWeek(syllabus){
    let days = syllabus.info.days.split('/');

    let delta = dayMap[days[1]] - dayMap[days[0]];
    let startDay = new Date(Date.parse(syllabus.info.start_date));
    let toggle = true;
    let groupped = syllabus.schedule.map((classDay,i)=>{
        
        let move = i%2? (7*(i-1)/2+delta):7*i/2;
        let curDay = new Date(startDay.valueOf());
        // console.log('start date', curDay, move);
        curDay.setDate(startDay.getDate() + move);
        classDay.week = `Week ${parseInt(i/2+1)}`;
        classDay.date = `${revDayMap[curDay.getDay()]}, ${curDay.getMonth()+1}/${curDay.getDate()}`;
        return classDay;
    }).reduce((acc,d,i)=>{
        if (acc[d.week]){
            acc[d.week].push(d);
        }else{
            acc[d.week] = [d];
        }
        return acc;
    },{});
    return Object.entries(groupped).map(([name,schedule])=>({name, schedule}));
}
function renderSchedule(weeks){
    let container = document.querySelector('.schedule');
    container.innerHTML='';
    weeks.forEach((week,i)=>{
       
        let weekElm = document.createElement('h3');
        weekElm.id = week.name
        weekElm.classList.add('week');
        weekElm.classList.add('title');
        weekElm.innerHTML = week.name;
        container.appendChild(weekElm);

        week.schedule.map(day=>{
            let child = renderDaySchedule(day);
            container.appendChild(child);
        });
        // let move = i%2? (7*(i-1)/2+delta):7*i/2;
        // let curDay = new Date(startDay.valueOf());
        // // console.log('start date', curDay, move);
        // curDay.setDate(startDay.getDate() + move);
        // let child = renderDaySchedule(classDay, curDay);
        // container.appendChild(child);

    });
}


function renderDaySchedule(d){
    let div = document.createElement('div');
    div.classList.add('class');
    div.innerHTML =  `
        <div class="header" id="${d.title}">
            <span class="date">${d.date}</span>
            <strong>${d.is_lab? '⚒':'📖'} ${d.title}</strong>
            &nbsp;<span>${d.slides?`(<a href="${d.slides}" target="_blank">Slides</a>)`:''}</span>
        </div>
        <div class="content">
            <p class="desc">${d.desc}</p>
            <p class="readings">
                ${renderReadings(d.readings)}
            </p>
        </div>
        `;
    return div;
}

function renderReadings(d){
    return `<ul> ${d.reduce((output, reading, i)=>{
        output+=`<li>
            ${(reading.required?'<strong>Required</strong>':'Optional')}:
            (<a class='reading-title' target='_blank' href='${reading.link}'>${reading.title}</a>)
            
        </li>`
        return output;
    },'')}</ul>`
}

let newsSearch = document.querySelector('.search input[name="schedule"');

newsSearch.addEventListener('input', function(event){
    // renderNews(allNews.filter(''))
    // console.log('value', this.value);
    if (this.value!=''){
        let filtered = [];
        syllabus.weeks.forEach((week,i)=>{
            if (week.name.toLowerCase().includes(this.value.toLowerCase())){
                filtered.push(week);
            }else{// filter individual schedule
                let copy = {...week};
                copy.schedule = copy.schedule.filter(d=>{
                    return (d.date + ' ' + d.title).toLowerCase().includes(this.value.toLowerCase());
                })
                filtered.push(copy);
            }
        })
        renderSchedule(filtered);
    }else{
        renderSchedule(syllabus.weeks);
    }
});