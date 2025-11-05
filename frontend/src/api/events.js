import eimg1 from '../images/event/img-1.jpg'
import eimg2 from '../images/event/img-2.jpg'
import eimg3 from '../images/event/img-3.jpg'

import eSimg1 from '../images/event/single/img-1.jpg'
import eSimg2 from '../images/event/single/img-2.jpg'
import eSimg3 from '../images/event/single/img-3.jpg'



const Events = [
    {
       Id:'1',
       eImg:eimg1,
       eSimg:eSimg1,
       thumb:'Conference',   
       title:'School For African Poor Children',  
       slug:'School-For-African-Poor-Children',
       month:'28',
       date:'July',
       time:'15:00 - 19:00',
       location:'New York',
       progress:'90',
       raised:'2000.00',
       goal:'3000.00',
    },
    {
       Id:'2',
       eImg:eimg2,
       eSimg:eSimg2,
       thumb:'Entertainment',    
       title:'The Greatest Convocation Of BMR College', 
       slug:'The-Greatest-Convocation-Of-BMR-College',
       month:'20',
       date:'Sep',
       time:'10:00 - 15:00',
       location:'Australia',
       progress:'80',
       raised:'3000.00',
       goal:'4000.00',
    },
    {
      Id:'3',
      eImg:eimg3,
      eSimg:eSimg3,
      thumb:'Conference',   
      title:'Virtual Spring Part-time Jobs Fair for Student',  
      slug:'Virtual-Spring-Part-time-Jobs-Fair-for-Student',
      month:'25',
      date:'Jun',
      time:'13:00 - 16:00',
      location:'Canada',
      progress:'95',
      raised:'4000.00',
      goal:'5000.00',
   }
    
]

export default Events;