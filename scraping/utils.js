function getRating(rating){
  switch(rating){
    case 'One':
      rating=1;
      break;
    case 'Two':
      rating=2;
      break;
    case 'Three':
      rating= 3;
      break;
    case 'Four':
      rating=4;
      break;
    default:
      rating=5;
      break;
  }
  return rating;
}
