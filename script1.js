const taskInput=document.getElementById("taskInput");
const addBtn=document.getElementById("addBtn");
const taskList=document.getElementById("taskList");
const filterBtns=document.querySelectorAll(".filters button");
const searchInput=document.getElementById("searchInput");
const dueDate=document.getElementById("dueDate");
const priority=document.getElementById("priority");

let tasks=JSON.parse(localStorage.getItem("tasks"))||[];

function saveTasks(){localStorage.setItem("tasks",JSON.stringify(tasks));}

function renderTasks(filter="all",search=""){
  taskList.innerHTML="";
  let today=new Date().toISOString().split("T")[0];
  let filtered=tasks.filter(t=>{
    if(search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
    if(filter==="all") return true;
    if(filter==="active") return !t.completed;
    if(filter==="completed") return t.completed;
    if(filter==="high") return t.priority==="high";
    if(filter==="today") return t.dueDate===today;
  });
  filtered.forEach((task,i)=>{
    const li=document.createElement("li");
    li.className=task.completed?"completed":"";
    li.innerHTML=`
      <div class="task-info">
        <div>${task.text}</div>
        <div class="task-meta">
          Due: ${task.dueDate||"No date"} |
          <span class="priority-${task.priority}">${task.priority.toUpperCase()}</span>
        </div>
      </div>
      <div class="actions">
        <button onclick="toggleComplete(${i})">✔</button>
        <button onclick="editTask(${i})">✎</button>
        <button onclick="deleteTask(${i})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask(){
  const text=taskInput.value.trim();
  if(!text) return;
  tasks.push({
    text,completed:false,
    dueDate:dueDate.value||"",
    priority:priority.value
  });
  taskInput.value="";dueDate.value="";
  saveTasks();renderTasks(getActiveFilter(),searchInput.value);
}

function toggleComplete(i){
  tasks[i].completed=!tasks[i].completed;
  saveTasks();renderTasks(getActiveFilter(),searchInput.value);
}

function editTask(i){
  const newText=prompt("Edit task:",tasks[i].text);
  if(newText){
    tasks[i].text=newText;
    saveTasks();renderTasks(getActiveFilter(),searchInput.value);
  }
}

function deleteTask(i){
  tasks.splice(i,1);
  saveTasks();renderTasks(getActiveFilter(),searchInput.value);
}

function getActiveFilter(){
  return document.querySelector(".filters button.active").dataset.filter;
}

addBtn.addEventListener("click",addTask);
taskInput.addEventListener("keypress",e=>{if(e.key==="Enter") addTask();});
searchInput.addEventListener("input",()=>{renderTasks(getActiveFilter(),searchInput.value);});
filterBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    filterBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter,searchInput.value);
  });
});

renderTasks();
