// 生成当前文件
function createFlillNode(flilldata) {
    var flillItem = document.createElement('li');
    flillItem.className = 'module-flill a';
    flillItem.innerHTML =  `<div class="module-checked a">
                                <em class="checked" a></em>
                            </div>
                            <div class="flill-famer a">
                                <span class="flill-icon a"></span>
                            </div>
                            <div class='name a'>
                            <div class="flill-name name-text show a">${flilldata.name}</div>
                            <input type="text" class="name-input a">
                            </div>`;
    var addFlillIdItems = flillItem.querySelectorAll('div');
    var flillIcon = flillItem.querySelector('.flill-icon');
    for(var i=0;i<addFlillIdItems.length;i++){
        addFlillIdItems[i].flillId = flilldata.id;
    }
    flillIcon.flillId = flilldata.id;
    flillItem.flillId = flilldata.id;
    const checked = flillItem.querySelector('.checked');
    checked.flillId = flilldata.id;
    return flillItem;
}
// 生成面包削导航
function createBreadNavNod(flilldata){
  const item = document.createElement('li');
  const leave = document.createElement('span');
  item.flillId = flilldata.id;
  item.innerHTML = flilldata.name;
  item.appendChild(leave);
  
  return item;
}
// 生成对话框
function createWarningInfo(message){
    const fsAlert = document.createElement('div');
    fsAlert.className = 'fuceng';
    fsAlert.innerHTML = `<div class="delet-famer">
                        <header class="delet-header">
                            <span class="close"></span>
                        </header>
                        <div class="delet-content">
                            <i></i><span><strong>${message}</strong><div> 以删除的文件可以在回收站找到</div></span>
                        </div>
                        <footer>
                                <span class="delet-sure sure">确定</span>
                                <span class="delet-cancel cancel">取消</span>
                        </footer>
                        </div>`;
 return fsAlert;
}
// 生成无序列表
function createTreeList(db,currentListId,id=0){
    const data = db[id];
    const floorIndex = getAllParents(db,id).length;
    const children = getChildrenById(db,id);
    const len = children.length;
    let str = `<ul>`;
    str +=`<li>
           <div   data-file-id="${data.id}" class="${currentListId === data.id ? 'active' : ''}"}" style='padding-left:${(floorIndex-1)*18}px'>
              <i  data-file-id="${data.id}"></i><span data-file-id="${data.id}">${data.name}</span>
           </div>`;
        if(len){
            for(let i=0;i<len;i++){
                str += createTreeList(db,currentListId,children[i].id);
            }
        }
      str +=`</li></ul>`;
      return str;
}
//  生成移动存储框
function createSaveposition(TreeList){
   const Saveposition = document.createElement('div');
   Saveposition.className = 'fuceng';
   Saveposition.innerHTML = `
   <div class="save-position">
   <header>选择要存储的位置<span class="close"></span></header>
   <div class="flill-name">
   </div>
    <!-- 多级菜单 -->
   <div class="save-page">
      ${TreeList}
   </div>
   <footer>
        <span class="save-sure sure">确定</span>
       <span class="save-cancel cancel">取消</span>
   </footer>
   </div>`;
   return Saveposition;
}