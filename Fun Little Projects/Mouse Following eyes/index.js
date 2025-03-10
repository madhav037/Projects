const eye = document.getElementById('eye');
const pupil = document.getElementById('eyeball');
const eye1 = document.getElementById('eye1');
const pupil1 = document.getElementById('eyeball1');


addEventListener('mousemove', movePupil);
addEventListener('mousemove', movePupil1);

function movePupil(event) {
  const eyeRect = eye.getBoundingClientRect();

  const eyeCenterX = eyeRect.left + eyeRect.width / 2;
  const eyeCenterY = eyeRect.top + eyeRect.height / 2;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const deltaX = mouseX - eyeCenterX;
  const deltaY = mouseY - eyeCenterY;

  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  const maxDistance = (eyeRect.width - pupil.offsetWidth) / 2;

  if (distance <= maxDistance) {
    pupil.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  } else {
    const scale = maxDistance / distance;
    pupil.style.transform = `translate(${deltaX * scale}px, ${deltaY * scale}px)`;
  }
}

function movePupil1(event) {
    const eyeRect = eye1.getBoundingClientRect();
  
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
  
    const mouseX = event.clientX;
    const mouseY = event.clientY;
  
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
  
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  
    const maxDistance = (eyeRect.width - pupil1.offsetWidth) / 2;
  
    if (distance <= maxDistance) {
      pupil1.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    } else {
      const scale = maxDistance / distance;
      pupil1.style.transform = `translate(${deltaX * scale}px, ${deltaY * scale}px)`;
    }
}