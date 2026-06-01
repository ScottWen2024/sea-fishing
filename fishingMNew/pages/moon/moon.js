Page({data:{weekDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],month:"",emptyCells:[],days:[]},
onLoad(){var n=new Date(),y=n.getFullYear(),m=n.getMonth(),d1=new Date(y,m,1),fd=d1.getDay(),dim=new Date(y,m+1,0).getDate(),td=n.getDate(),empty=[];for(var i=0;i<fd;i++)empty.push(i);
var days=[],icons=["","","","","","","","","","","","","","",""];
var known=new Date("2026-05-08");
for(var d=1;d<=dim;d++){var ds=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");var dn=new Date(ds);var daysSince=Math.round((dn-known)/86400000);var age=((daysSince%29.53)+29.53)%29.53;var idx=Math.floor(age/29.53*icons.length)%icons.length;days.push({day:d,icon:icons[idx],isToday:d===td,isSpring:idx===0||idx===7})}
this.setData({month:String(m+1),emptyCells:empty,days:days})}})