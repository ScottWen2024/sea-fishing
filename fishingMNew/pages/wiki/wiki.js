Page({data:{list:[],sel:null},
FISH:[{name:"Black Porgy",icon:"",alias:"Haifu",temp:"18-25C",depth:"3-50m",time:"rising tide",season:"spring/fall",methods:"bottom/rock",taste:"4/5",desc:"Nearshore bottom fish. Omnivorous. Common year-round in Guangdong."},
{name:"Red Seabream",icon:"",alias:"Jiayu",temp:"15-22C",depth:"10-80m",time:"high tide",season:"fall/winter",methods:"bottom/boat/lure",taste:"5/5",desc:"Premium fish. Bright red body. Best quality in winter."},
{name:"Grouper",icon:"",alias:"Longdan",temp:"20-30C",depth:"5-60m",time:"rising tide",season:"spring/summer",methods:"bottom/boat/live bait",taste:"5/5",desc:"Warm water bottom fish. Fierce. Use thick line and big hook."},
{name:"Yellowfin Bream",icon:"",alias:"Huangjiao",temp:"18-28C",depth:"2-30m",time:"high tide",season:"spring/fall",methods:"rock/raft",taste:"4/5",desc:"Shallow water common fish. Sensitive bite needs light rig."},
{name:"Spanish Mackerel",icon:"",alias:"Mayou",temp:"18-28C",depth:"5-50m",time:"dawn/dusk",season:"summer/fall",methods:"trolling/lure",taste:"4/5",desc:"Pelagic migratory. Fast swimmer. Exciting fight."},
{name:"Hairtail",icon:"",alias:"Baidai",temp:"15-25C",depth:"10-100m",time:"night/dawn",season:"fall/winter",methods:"boat/night",taste:"3/5",desc:"Deep water. Sharp teeth. Be careful when handling."},
{name:"Croaker",icon:"",alias:"Huanghua",temp:"16-24C",depth:"10-60m",time:"morning/dusk",season:"spring/fall",methods:"boat/bottom",taste:"5/5",desc:"Premium. Wild stocks declined. Catch is precious."}],
onLoad(){this.setData({list:this.FISH})},
showDetail(e){this.setData({sel:this.FISH[e.currentTarget.dataset.idx]})},
closeDetail(){this.setData({sel:null})}
})