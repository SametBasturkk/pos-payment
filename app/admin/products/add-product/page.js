"use client";
var count = 0;
var count1 = 0;

String.prototype.turkishtoEnglish = function () {
  return this.replace("Ğ", "g")
    .replaceAll("Ü", "u")
    .replaceAll("Ş", "s")
    .replaceAll("I", "i")
    .replaceAll("İ", "i")
    .replaceAll("Ö", "o")
    .replaceAll("Ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
};

const foodCategoryInput = () => {
  var foodCategory = document.createElement("input");

  foodCategory.setAttribute("type", "text");
  foodCategory.setAttribute("placeholder", "Food Category");
  foodCategory.setAttribute("id", "foodCategory" + " " + count);
  foodCategory.setAttribute("class", "foodCategory");
  document.getElementById("menuItems").appendChild(foodCategory);

  count = count + 1;
};
const foodNameInput = () => {
  console.log(count1);

  var foodName = document.createElement("input");
  foodName.setAttribute("type", "text");
  foodName.setAttribute("placeholder", "Food Name");
  foodName.setAttribute("id", "foodName" + " " + count1);
  document.getElementById("menuItems").appendChild(foodName);

  var foodPrice = document.createElement("input");
  foodPrice.setAttribute("type", "text");
  foodPrice.setAttribute("placeholder", "Food Price");
  foodPrice.setAttribute("id", "foodPrice" + " " + count1);
  document.getElementById("menuItems").appendChild(foodPrice);

  var foodUploadImage = document.createElement("input");
  foodUploadImage.setAttribute("type", "file");
  foodUploadImage.setAttribute("name", "file");
  foodUploadImage.setAttribute("placeholder", "Upload Image");
  foodUploadImage.setAttribute(
    "id",
    "foodUploadImage" + " " + count1 + " " + "fileInput"
  );
  foodUploadImage.setAttribute("class", "foodUploadImage");
  foodUploadImage.setAttribute("accept", "image/*");
  foodUploadImage.setAttribute("enctype", "multipart/form-data");
  document.getElementById("menuItems").appendChild(foodUploadImage);

  var foodbreak = document.createElement("br");
  foodbreak.setAttribute("id", "foodbreak");
  document.getElementById("menuItems").appendChild(foodbreak);

  count1 = count1 + 1;
};

function uploadImage() {
  for (var i = 0; i < count1; i++) {
    var fileInput = document.getElementById(
      "foodUploadImage" + " " + i + " " + "fileInput"
    );
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    fetch("http://localhost:3001/fileUpload", {
      method: "POST",
      headers: {
        user_id: localStorage.getItem("userid"),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      });
  }
}

const saveMenu = () => {
  const menuTemplate = [];

  var temp = document.getElementById("menuItems").childNodes;

  for (var i = 0; i < temp.length; i++) {
    if (temp[i].id.includes("foodCategory")) {
      menuTemplate.push({ foodCategory: temp[i].value });
    } else if (temp[i].id.includes("foodName")) {
      menuTemplate.push({ foodName: temp[i].value });
    } else if (temp[i].id.includes("foodPrice")) {
      menuTemplate.push({ foodPrice: temp[i].value });
    } else if (temp[i].id.includes("foodUploadImage")) {
      menuTemplate.push({ foodUploadImage: temp[i].value });
    } else if (temp[i].id.includes("foodbreak")) {
      menuTemplate.push({ foodbreak: "break" });
    }
  }
  console.log(menuTemplate);

  fetch("http://localhost:3001/saveMenu", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      menuJSON: menuTemplate,
      menuName: document.getElementById("menuName").value,
      userid: localStorage.getItem("userid"),
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    });

  uploadImage();
};

function NewMenu() {
  return (
    <div>
      <h1>Create New Menu</h1>
      <input type="text" placeholder="Menu Name" id="menuName" />
      <br></br>
      <button onClick={foodCategoryInput}>Add Food Category</button>
      <button onClick={foodNameInput}>Add Food Name</button>
      <div id="menuItems"></div>
      <button onClick={saveMenu}>Save Menu</button>
    </div>
  );
}

export default NewMenu;
