const mongoose=require('mongoose')
const Campground=require('./models/campground')
const Comment=require('./models/comment')
let data=[
  { 
    name : 'Mount Ranier', 
    image : 'https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg',
    location : 'Washington',
    author:{
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
      },
      username:String
  },
    description:'From the American Indian tribes who gathered resources in the area for millennia to the bustling park that exists on the land today, a wide variety of groups have found meaning and importance in the mountain now called Mount Rainier. All of these groups mapped their values on the landscape and contributed to a broader sense of what the area should be. Though these values were often very different and sometimes conflicted, they are all held together today in a delicate balance by the park. The mountain is a product of its past in more than just a geological sense: understanding the human history of Mount Rainier is crucial to realizing the intricacy of the mountain today.'
  },
  {
    name: 'Lassen Volacanic',
    image : 'https://www.nps.gov/lavo/planyourvisit/images/southwest-campground_6081614_2.jpg', 
    location : 'California',
    author:{
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
      },
      username:String
  },
    description:'Stories of human experience from prehistoric to present day are woven into the landscape of Lassen Volcanic National Park. From American Indians who utilized the Lassen region as a meeting point and seasonal camp, to explorers and pioneers lured by the gold rush and the desire to explore the West; these individuals and groups shaped the park and they way we experience it today.' 
  },
  {
    name : 'Shenandoah', 
    image : 'https://www.nps.gov/shen/planyourvisit/images/20180807_Dundo_SNP5273_mo-1_1.jpg', 
    location : 'Virginia',
    author:{
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
      },
      username:String
  },
    description:'The first traces of humans within Shenandoah National Park are around 8,000 to 9,000 years old. Native Americans seasonally visited this area to hunt, gather food, source materials for stone tools, and trade. In the 1700s, European hunters and trappers explored the mountains of the Blue Ridge and Shenandoah Valley. Soon after 1750, European settlers moved into the lower hollows near springs and streams. Over the next century and a half hundreds of families worked the land, planting orchards and crops, building homesteads and mills, using the mountains for logging and mining.' 
  },
  {
    name : 'Zion',
    image : 'https://www.nps.gov/zion/planyourvisit/images/Campground_1.jpg',
    location : 'Utah',
    author:{
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
      },
      username:String
  },
    description:'Zion National Park has three campgrounds. South and Watchman Campgrounds are in Zion Canyon. The Lava Point Campground is about a 1-hour drive from Zion Canyon on the Kolob Terrace Road. There are no campgrounds in Kolob Canyons. Camping is permitted in designated campsites, but not in pullouts or parking lots. Camping is popular; all campgrounds are often full by mid-morning. From mid-March through late November the campgrounds are full almost every night. Reservations at South Campground and Watchman Campground (Call 877-444-6777 or visit www.recreation.gov) are recommended if you would like to guarantee a camping spot.' 
  }
]
function seedDB(){
  Campground.deleteMany({},(err)=>{
    if(err){
        console.log(err);
    }
    data.forEach(seed=>{
      Campground.create(seed,(err,campground)=>{
        if(err){
          console.log(err);
        }else{
          Comment.create({
            text:"This place is great but I wish there was internet",
            author:{
              id:"588c2e092403d111454fff76",
              username:"Jack"
            }
          },(err,comment)=>{
            if(err){
              console.log(err);
            }else{
              campground.comments.push(comment);
              campground.save();
            }
          });
        }
      });
    });
  });

}
module.exports=seedDB;