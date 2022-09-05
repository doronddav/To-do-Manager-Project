let addBtn = document.getElementById("addBtn");
let listOutput = document.getElementById("listOutput");
let planInput = document.getElementById("planningInput");
let textnode;
let listItem = false;

let planingList = [];

class Plan {
  constructor(app, text, status = false, id = Date.now()) {
    this.app = app;
    this.text = text;
    this.status = status;
    this.id = id;
  }

  renderToDoList() {
    console.log(this.app);
    let node = document.createElement("li");
    node.setAttribute("id", "listItem");
    node.setAttribute("data-key", this.id);
    node.innerHTML = `
  
  <span>${this.text}<br></span>
  <div>
    <input id="${this.id}" class="checkStatus${this.id} doneBtn " type="checkbox"/>

 <button class="editBtn${this.id} editBtn">
  
    Edit
  
     </button>





    <button class="deleteBtn${this.id} DeleteBtn">
  
    delete
  
     </button>
     <div>
<br>
  `;
    listOutput.appendChild(node);

    let deleteBtn = document.querySelector(`.deleteBtn${this.id}`);
    deleteBtn.addEventListener("click", function (e) {
      let buttonId = e.target.parentElement.parentElement.dataset.key;
      console.log(buttonId);
      node.remove();
      let itemToDelete = planingList.filter((task) => {
        return task.id == buttonId;
      });
      planingList = planingList.filter((task) => {
        return task.id != buttonId;
      });
      console.log(planingList);
      console.log(itemToDelete[0]);

      itemToDelete[0].app.setLocalStorage();
    });

    let checkStatus = document.querySelector(`.checkStatus${this.id}`);
    checkStatus.addEventListener("click", function (e) {
      let buttonId = e.target.parentElement.parentElement.dataset.key;
      let itemChecked = planingList.filter((task) => {
        return task.id == buttonId;
      });
      itemChecked[0].status = itemChecked[0].status ? false : true;
      itemChecked[0].app.setLocalStorage();
    });
    if (this.status == true) checkStatus.checked = true;
    else checkStatus.checked = false;

    let editTask = document.querySelector(`.editBtn${this.id}`);
    editTask.addEventListener("click", function (e) {
      planInput.classList.add("glow");
      let buttonId = e.target.parentElement.parentElement.dataset.key;
      console.log(buttonId);
      let itemToChange = planingList.filter((task) => {
        return task.id == buttonId;
      });
      planingList = planingList.filter((task) => {
        return task.id != buttonId;
      });
      console.log(planingList);
      console.log(itemToChange[0]);
      planInput.value = itemToChange[0].text;
      itemToChange[0].app.setLocalStorage();
      node.remove();
    });
  }
}

class App {
  constructor() {
    this._getlocalStorage();
    addBtn.addEventListener("click", this.savePlan.bind(this));
  }
  savePlan(e) {
    e.preventDefault();
    const text = planInput.value;
    console.log(planingList);
    if (!this.validateTask(planInput)) {
      return;
    } else {
      let plan = new Plan(this, text);
      planingList.push(plan);
      console.log(planingList);
      plan.renderToDoList();
      this.setLocalStorage();
      planInput.value = "";
      planInput.classList.remove("glow");
    }
  }
  validateTask() {
    let returnValidation = true;
    if (Number(planInput.value) || !planInput.value) {
      alert("plan can't be a number or empty");
      planInput.value = "";
      return false;
    }
    planingList.map((plan) => {
      if (plan.text == planInput.value) {
        alert(`you can't add the same plan twice`);
        planInput.value = "";
        returnValidation = false;
      }
    });

    return returnValidation;
  }
  setLocalStorage() {
    localStorage.setItem("plans", JSON.stringify(planingList));
    console.log(planingList);
  }
  _getlocalStorage() {
    let data = localStorage.getItem("plans");
    if (data) data = JSON.parse(data);

    // console.log(data);

    if (!data) return;

    data.forEach((plan) => {
      let task = new Plan(this, plan.text, plan.status, plan.id);
      planingList.push(task);

      task.renderToDoList();
    });
  }
}
const app = new App();
