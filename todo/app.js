import TaskItem from "./components/taskItem.js";




  
  let introTasks=[{name:'welcome to todo 🎉🎉',done:false,createdOn:'',note:'',priority:""},{name:'tap on a task to add notes/priority to it📝',done:'',createdOn:'',note:"",priority:""}]
  

  
  
  let taskname=reactable('')
  export let tasks=reactable(localStorage.tasks?JSON.parse(localStorage.tasks):introTasks)
  export let sound=new Audio('./resources/success.mp3')
  sound.preload="auto"
 
  let currentDate=new Date()
  let defaultDue=new Date()
  defaultDue.setUTCDate(currentDate.getUTCDate()+2)
  defaultDue.setUTCHours(0,0,0)
  defaultDue=defaultDue.toISOString().slice(0,16)
  


el("hgroup",{class:'container'}). 
  _el("h3","today").$end(). 
  _el("p",`${currentDate.toLocaleString("en-us",{weekday:'long'}).toLowerCase()} ,${currentDate.getDate()} ${currentDate.toLocaleString("en-us",{month:'long'})}`).$end(). 
  style({
    paddingTop:'2.4rem'
  })

  
  let today=reactable().deriveFrom(tasks,(task)=>{

    return tasks.value.filter((t)=>{


      return new Date()<new Date(t.due)
         })
  })
  let yesterday=reactable().deriveFrom(tasks,(task)=>{
    return tasks.value.filter((t)=>{
      return new Date()>new Date(t.due)
         })
  })

  let SELECTED_VIEW=today

  //form fiel-----------------------------------------------------
  el('form').style({
    position:'fixed',
    bottom:'0.5rem',
    width:'90%',
    right:'50%',
    transform:'translateX(50%)'
    
  })
  ._el('fieldset',{
    role:'group'
  }).
    _el('input',{
      type:'text',
        ariaLabel:'taskname field'
      ,placeHolder:'enter task'
      ,autocomplete:'off'
    }).model(taskname).$end().
    _el('input',{
      type:'submit',
      value:'add task'
    
    }).$end()
  .$end().
  checkFor('submit',(e)=>{
    e.preventDefault()
    if(taskname.value !=''){
      
      
      tasks.value.push({
        name:taskname.get(),
        done:false,
        createdOn:`${currentDate.toLocaleDateString('en-GB')}      ${currentDate.toLocaleTimeString('en-US')}`,
        note:'',
        priority:'no priority',
        due:defaultDue,
        isHabit:false
      })
      tasks.update()
      taskname.set('')   
    }
  })
  //task area------------------------------------------------
  el('ul').style({
  listStyle:'none',
  padding:'0px',
  paddingTop:'2rem',
    margin:'0px'
  }).loops(SELECTED_VIEW,(obj,p)=>{
  
    TaskItem(obj).addTo(p)
    
  }).$end()
  //due tasks---------------------
  let records=
  el('section')
  ._el('hgroup',{id:'no-task'}).style({textAlign:'center',padding:'2rem',paddingTop:'1rem'}).
  _el('h5','you have no pending tasks').$end()
  ._el('p','add a new task by entering the name of task in the field above').$end().$end()
  ._el('div',{class:'container'})
  ._el('details').style({
    marginTop:'4rem'
  }).
    _el('summary','over due tasks').$end(). 
    _el('p').loops(yesterday,(obj,p)=>{
      if(!obj.done){
        TaskItem(obj).addTo(p)
      }
    }).$end().$end().
    _el('details').
    _el('summary','completed earlier').$end(). 
    _el('p').loops(yesterday,(obj,p)=>{
      if(obj.done){
        TaskItem(obj).addTo(p)
      }
    }).$end()


  
  
  
  //updating the localstorage each time tasks is updated
  tasks.subscribe(()=>{
   
  localStorage.tasks=JSON.stringify(tasks.value)
  
  
    $el('#no-task').showIf(tasks.value.length==0)
  
  
  })
  tasks.update()
