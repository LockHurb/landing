function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) {
    console.warn(`No existe ningún elemento con id="${sectionId}"`);
    return;
  }
  el.scrollIntoView({
    behavior: 'smooth',  // desplazamiento suave
    block: 'start'       // arriba de todo del viewport
  });
}