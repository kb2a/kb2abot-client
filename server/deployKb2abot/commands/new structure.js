module.exports = {
 
 
  friendlyName: 'Plugin tên gì đó',
 
 
  keywords: ['all', 'everyone', 'a', 'e'],
  // Dùng để gọi lệnh, nếu cho prefix = /
  // thì sẽ là /all, /everyone, /a, /e
 
 
  description: 'Mention all member in group',
 
 
  extendedDescription: "Hướng dẫn sử dụng: bla bla",
  // 2 cái des ở trên và friendlyName để hiển thị trong help
 
 
  fn: async function (input) { // đây là function chính của plugin
    //input là phần input của user 
    // ví dụ : /command <text>
    // thì input là phần <text>
 
    console.log(nikola);
    /* 
    biến nikola sẽ luôn đc defined trong các function fn của plugin
    nikola = {
      helpers: {
        //Gồm các function helper
      },
      plugins: {
        //Gồm các properties của plugin (bao gồm cả fn function)
        //Có thể gọi nhiều plugin trong 1 plugin (liên plugin)
      },
      ... còn nữa
    }
    */
 
    const actions = []; // tự khai báo mảng các actions cần đc call trong api của fca
    /*
    vd: {
      name: "sendMessage"
      data: [<message>, <threadID>[ ,<js callback>, <messageID>]]
    }
    Cách thức hoạt động bên base:
    api[name](...data); // Nếu data là array
    api[name](data)// Nếu data là 1 Object
     */
 
    return actions; // return actions :v
  }
 
};