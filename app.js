// Storage Controler
const StorageCtr = (function () {
  //Public Methods
  return {
    setStorage: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        // Set new ls
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();
// Item Controler
const ItemCtr = (function () {
  // Item constructor
  const Item = function (id, item, calor) {
    this.id = id;
    this.name = item;
    this.totalCalories = calor;
  };
  // Data Constructor
  const data = {
    // items: [
    //   // { id: 0, name: "Stake", totalCalories: 1200 },
    //   // { id: 1, name: "Pizza", totalCalories: 400 },
    //   // { id: 2, name: "Pop Juice", totalCalories: 200 },
    // ],
    items: StorageCtr.getStorage(),
    currentItem: null,
    totalCalories: 0,
  };
  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addData: function (newItem) {
      let ID;
      if (data.items == "") {
        ID = 0;
      } else {
        ID = data.items[data.items.length - 1].id + 1;
      }
      newItem.calories = parseInt(newItem.calories);
      let newerItem = new Item(ID, newItem.name, newItem.calories);
      data.items.push(newerItem);
      return newerItem;
    },
    setTotal: function () {
      let tot = 0;
      data.items.forEach((el) => {
        tot += el.totalCalories;
      });
      data.totalCalories = tot;
      return data.totalCalories;
    },
    getById: function (id) {
      let found;
      data.items.forEach((item) => {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      let found;
      data.items.forEach((item) => {
        if (item.id == data.currentItem.id) {
          item.totalCalories = parseInt(calories);
          item.name = name;
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    deleteItem: function (id) {
      let ids = data.items.map(function (item) {
        return item.id;
      });
      let index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearAll: function () {
      data.items = [];
    },
  };
})();
// UI Controler
const UICtr = (function () {
  let select = {
    itemlist: "#item-list",
    itemListLi: "#item-list li",
    addBtn: ".add-btn",
    clearBtn: ".clear-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemName: "#item-name",
    itemCalor: "#item-calories",
    total: ".total-calories",
  };
  // Public Methods
  return {
    populateListItems: function (it) {
      let html = ``;
      it.forEach((element) => {
        html += `
        <li class="collection-item" id="item-${element.id}">
        <strong>${element.name}: </strong> <em>${element.totalCalories}Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
        `;
      });
      document.querySelector(select.itemlist).innerHTML = html;
    },
    getInput: function () {
      let name = document.querySelector(select.itemName).value;
      let calories = document.querySelector(select.itemCalor).value;
      return {
        name,
        calories,
      };
    },
    getSelect: function () {
      return select;
    },
    updateListItems: function (item) {
      let itemlist = document.querySelectorAll(select.itemListLi);
      itemlist = Array.from(itemlist);
      itemlist.forEach((it) => {
        let id = it.getAttribute("id");
        if (id === `item-${item.id}`) {
          document.querySelector(
            `#${id}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.totalCalories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },
    addToList: function (newItem) {
      // Check if list items display
      console.log(document.querySelector(select.itemlist));
      document.querySelector(select.itemlist).style.display = "";
      // Create a new element
      let li = document.createElement("li");
      // Class
      li.className = "collection-item";
      // Id
      li.id = `item-${newItem.id}`;
      // Inner
      li.innerHTML = `<strong>${newItem.name}: </strong> <em>${newItem.totalCalories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      `;
      // Append
      document
        .querySelector(select.itemlist)
        .insertAdjacentElement("beforeend", li);
    },
    showTotal: function (total) {
      document.querySelector(select.total).innerText = `${total}`;
    },
    clearEditState: function () {
      document.querySelector(select.deleteBtn).style.display = "none";
      document.querySelector(select.updateBtn).style.display = "none";
      document.querySelector(select.backBtn).style.display = "none";
      document.querySelector(select.addBtn).style.display = "";
    },
    deleteFields: function () {
      document.querySelector(select.itemName).value = "";
      document.querySelector(select.itemCalor).value = "";
    },
    deleteList: function () {
      document.querySelector(select.itemlist).style.display = "none";
    },
    setFields: function () {
      let item = ItemCtr.getCurrentItem();
      document.querySelector(select.itemName).value = item.name;
      document.querySelector(select.itemCalor).value = item.totalCalories;
    },
    setUpdateState: function () {
      document.querySelector(select.deleteBtn).style.display = "";
      document.querySelector(select.updateBtn).style.display = "";
      document.querySelector(select.backBtn).style.display = "";
      document.querySelector(select.addBtn).style.display = "none";
    },
    removeItem: function (id) {
      let list = document.querySelectorAll(select.itemListLi);
      list = Array.from(list);
      list.forEach((item) => {
        if (item.getAttribute("id") == `item-${id}`) {
          item.remove();
        }
      });
    },
    removeAll: function () {
      let list = document.querySelectorAll(select.itemListLi);
      list = Array.from(list);
      list.forEach((item) => {
        item.remove();
      });
      UICtr.deleteList();
    },
  };
})();
// App Controler
const AppCtr = (function (ItemCtr, StorageCtr, UICtr) {
  let items = ItemCtr.logData();

  const events = function () {
    let select = UICtr.getSelect();
    // Event on init state
    document.querySelector(select.addBtn).addEventListener("click", addEvent);
    // Event on update state
    document
      .querySelector(select.itemlist)
      .addEventListener("click", updateEvent);
    // Enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    // Update Item
    document
      .querySelector(select.updateBtn)
      .addEventListener("click", submitItem);
    // Back state
    document.querySelector(select.backBtn).addEventListener("click", backEvent);
    // Delete state
    document
      .querySelector(select.deleteBtn)
      .addEventListener("click", deleteEvent);
    // Clear All Event
    document
      .querySelector(select.clearBtn)
      .addEventListener("click", clearEvent);
  };
  const submitItem = function (e) {
    e.preventDefault();
    let input = UICtr.getInput();
    const updatedItem = ItemCtr.updateItem(input.name, input.calories);
    UICtr.updateListItems(updatedItem);
    StorageCtr.updateStorage(updatedItem);
    let total = ItemCtr.setTotal();
    UICtr.showTotal(total);
    UICtr.clearEditState();
    UICtr.deleteFields();
  };
  const addEvent = function (e) {
    e.preventDefault();
    let input = UICtr.getInput();
    if (input.name !== "" && input.calories !== "") {
      let newItem = ItemCtr.addData(input);
      UICtr.addToList(newItem);
      StorageCtr.setStorage(newItem);
      UICtr.deleteFields();
      let total = ItemCtr.setTotal();
      UICtr.showTotal(total);
    }
  };
  const updateEvent = function (e) {
    if (e.target.classList.contains("edit-item")) {
      let id = e.target.parentNode.parentNode.id;
      id = id.split("-")[1];
      id = parseInt(id);
      const currentItem = ItemCtr.getById(id);
      ItemCtr.setCurrentItem(currentItem);
      UICtr.setFields();
      UICtr.setUpdateState();
    }
    e.preventDefault();
  };
  const backEvent = function (e) {
    e.preventDefault();
    UICtr.clearEditState();
    UICtr.deleteFields();
  };
  const deleteEvent = function (e) {
    e.preventDefault();
    let current = ItemCtr.getCurrentItem();
    ItemCtr.deleteItem(current.id);
    UICtr.removeItem(current.id);
    StorageCtr.deleteStorage(current.id);
    UICtr.clearEditState();
    UICtr.deleteFields();
    let total = ItemCtr.setTotal();
    UICtr.showTotal(total);
  };
  const clearEvent = function (e) {
    e.preventDefault();
    ItemCtr.clearAll();
    UICtr.removeAll();
    StorageCtr.clearStorage();
    UICtr.clearEditState();
    UICtr.deleteFields();
    let total = ItemCtr.setTotal();
    UICtr.showTotal(total);
  };
  // Public Methods
  return {
    init: function () {
      // Clear Edit state
      UICtr.clearEditState();
      const itemsGroup = ItemCtr.getItems();
      if (itemsGroup.length === 0) {
        UICtr.deleteList();
      } else {
        UICtr.populateListItems(itemsGroup);
      }
      let total = ItemCtr.setTotal();
      UICtr.showTotal(total);
      // Event Listener Call
      events();
    },
  };
})(ItemCtr, StorageCtr, UICtr);
// Init Call
AppCtr.init();
