// images
import blogImg1 from "../images/blog/img-1.jpg";
import blogImg2 from "../images/blog/img-2.jpg";
import blogImg3 from "../images/blog/img-3.jpg";

import blogSingleImg1 from "../images/blog/blog-single/img-1.jpg";
import blogSingleImg2 from "../images/blog/blog-single/img-2.jpg";
import blogSingleImg3 from "../images/blog/blog-single/img-3.jpg";



const blogs = [
    {
        id: '1',
        title: 'The Surprising Reason College Tuition Is Crazy Expensive',
        slug:'The-Surprising-Reason-College-Tuition-Is-Crazy-Expensive',
        screens: blogImg1,
        description: 'Lorem sum has been the industry standard dummy of the text ever since the scrambled it to make.',
        author: 'Loura Sweety',
        create_at: '25 Sep 2023',
        blogSingleImg:blogSingleImg1, 
        comment:'35',
        day:'28',
        month:'AUGUST',
        blClass:'format-standard-image',
        animation:'1200',
    },
    {
        id: '2',
        title: 'Become a great WordPress & PHP developer.',
        slug:'Become-a-great-WordPress-&-PHP-developer.',
        screens: blogImg2,
        description: 'Lorem sum has been the industry standard dummy of the text ever since the scrambled it to make.',
        author: 'David Luis',
        create_at: '23 Sep 2023',
        blogSingleImg:blogSingleImg2, 
        comment:'80',
        day:'25',
        month:'March',
        blClass:'format-standard-image',
        animation:'1400',
    },
    {
        id: '3',
        title: 'A critical review of mobile learning integration',
        slug:'A-critical-review-of-mobile-learning-integration',
        screens: blogImg3,
        description: 'Lorem sum has been the industry standard dummy of the text ever since the scrambled it to make.',
        author: 'Jenefer Willy',
        create_at: '21 Sep 2023',
        blogSingleImg:blogSingleImg3,
        comment:'95',
        day:'23',
        month:'Sep',
        blClass:'format-video',
        animation:'1600',
    }
];
export default blogs;