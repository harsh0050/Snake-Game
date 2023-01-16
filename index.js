class Node{
    constructor(i, j){
       this.i = i;
       this.j = j; 
       this.bg = "url('sanp.jpg')";
    }
    setVal(){
        this.bg="url('dorr.png')";
    }
    next;  
    static tail;
    static head;
}

var currScore = 5;
var speed;
var diff = prompt("Choose dificulty: (Easy, Medium, Hard)");
diff.toLowerCase();
if(diff==="easy" || diff==="e"){
    speed = 400;
}else if(diff==="medium" || diff==="m"){
    speed = 200;
}else{
    speed = 100;
}
var playground= new Array(29);
for(var i = 0; i<playground.length; i++){
    playground[i]=new Array(42);
}
function generateSaanp(){
    var tl = new Node(1,1);
    tl.next = new Node(1,2);
    tl.next.next = new Node(1,3);
    tl.next.next.next = new Node(1,4);
    tl.next.next.next.next = new Node(1,5);
    Node.tail = tl;
    Node.head = tl.next.next.next.next;
    var temp = tl;

    while(temp!=null){
        playground[temp.i][temp.j]=temp;
        temp = temp.next;
    }
}
generateSaanp();

//even listener:
var currKey ='d';
document.addEventListener('keypress', (event)=>{
    if(isValidKey(event.key))
        currKey = event.key;
});

//food:
var currFood = generateFood();
function ifSafeFood(row, col){
    temp = Node.tail;
    while(temp!=null){
        if(row==temp.i && col==temp.j){
            return false;
        }
        temp = temp.next;
    }
    return true;
}

async function launch(){
    prtPlaygrdf();
    while(true){
        var x = move(currKey);
        prtPlaygrdf();
        if(!x){
            alert("bruuhhh\nCurrent Score: " + currScore);

            var x = prompt("Play Again? (Y/N)");
            if(x=="Y"|| x=="y"){
                location.reload();
            }else{
                return;
            }
            
        }
        await sleep(speed);
    }
}
launch();

 
//-------------------------------------------------
function removeLast(){
    if(Node.head.i==currFood[0] && Node.head.j==currFood[1]){
        currScore++;
        currFood = generateFood();
    }else{
        playground[Node.tail.i][Node.tail.j]=null;
        Node.tail = Node.tail.next;
    }
}
function right(){
    if(isAllowed('d')){
        var newNode = new Node(Node.head.i, Node.head.j+1);
        playground[newNode.i][newNode.j]=newNode;
        Node.head.next = newNode;
        Node.head=newNode;
        removeLast();
        return true;
    }
    return false;
}
function down(){
    if(isAllowed('s')){
        var newNode = new Node(Node.head.i+1, Node.head.j);
        playground[newNode.i][newNode.j]=newNode;
        Node.head.next = newNode;
        Node.head=newNode;
        removeLast();
        return true;
    }
    return false;
}
function left(){
    if(isAllowed('a')){
        var newNode = new Node(Node.head.i, Node.head.j-1);
        playground[newNode.i][newNode.j]=newNode;
        Node.head.next = newNode;
        Node.head=newNode;
        removeLast();
        return true;
    }
    return false;
}
function up(){
    if(isAllowed('w')) {
        var newNode = new Node(Node.head.i - 1, Node.head.j);
        playground[newNode.i][newNode.j] = newNode;
        Node.head.next = newNode;
        Node.head = newNode;
        removeLast();
        return true;
    }
    return false;
}
//------------------------------------------

function move(mo){
    switch (mo){
        case 'd':
            return right();
        case 'w':
            return up();
        case 'a':
            return left();
        case 's':
            return down();
        case "Enter":
            return true;
        default:
            return move(currKey);
    }
}

function isAllowed(next){
    var nextC = getNextCoord(next);
    if(nextC[0]>= playground.length-1 || nextC[0]<1 || nextC[1]>= playground[0].length-1 || nextC[1]<1){
        return false;
    }else{
        var temp = Node.tail;
        while(temp!=null){
            if(nextC[0]==temp.i && nextC[1]== temp.j){
                return false;
            }
            temp = temp.next;
        }
        return true;
    }
}

function getNextCoord(next){
    var currI = Node.head.i;
    var currJ = Node.head.j;
    switch (next){
        case 'd':
            return [currI, currJ+1];
        case 'w':
            return [currI-1, currJ];
        case 'a':
            return [currI, currJ-1];
        case 's':
            return [currI+1, currJ];
        default:
            return getNextCoord(currKey);
    }
}

for(var j =0; j<playground[0].length;j++){
    document.getElementById(getNum(playground.length-1,j)).style.backgroundColor="black";
    document.getElementById(getNum(0,j)).style.backgroundColor="black";
}
for(var i = 0; i<playground.length; i++){
    document.getElementById(getNum(i,0)).style.backgroundColor="black";
    document.getElementById(getNum(i,41)).style.backgroundColor="black";
    
}
function prtPlaygrdf(){
    document.getElementById("0000").innerHTML=currScore;
    for(var i = 1; i<playground.length-1; i++){
        for(var j = 1; j<playground[0].length-1; j++){
            var num= getNum(i,j);
            document.getElementById(num).style.backgroundImage=playground[i][j]!=null?playground[i][j].bg:"none";
            document.getElementById(num).style.backgroundSize="100%";
        }
    }
}
 function generateFood(){
    var mult = (playground.length-2) * (playground[0].length-2);
    var rand = Math.trunc(Math.random()*mult+1);
    var row = Math.trunc((rand-1)/(playground[0].length-2))+1;
    var col = (rand-1)%(playground.length-2)+1;
    if(ifSafeFood(row, col)){
        let food = new Node(row, col);
        console.log(row+" " + col);
        food.setVal();
        playground[row][col]= food;
        return [row, col];
    }
    return generateFood();
}

function isValidKey(mo){
    if(mo=='d'||mo=='a'||mo=='w'||mo=='s'|| mo=="Enter"){
        var nxtC = getNextCoord(mo);
        if(playground[nxtC[0]][nxtC[1]]!=null && playground[nxtC[0]][nxtC[1]].next==Node.head){
            return false;
        }
        return true;
    }
        
    return false;
}

//delay:
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNum(i, j){
    if(i<10){
        if(j<10){
            return "0"+i+"0"+j;
        }else{
            return "0"+i+""+j;
        }
    }else{
        if(j<10){
            return i+"0"+j;
        }else{
            return i+""+j;
        }
    }
}