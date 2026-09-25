const russian: Record<string,string> = {
  'Algebra':'Алгебра','Geometriya':'Геометрия','Fizika':'Физика','Ingliz tili':'Английский язык',
  'Rus tili':'Русский язык','O‘zbek tili':'Узбекский язык','Ona tili':'Родной язык','Nemis tili':'Немецкий язык',
  'Informatika':'Информатика','Kimyo':'Химия','Geografiya':'География','Jahon tarixi':'Всемирная история',
  'O‘zbekiston tarixi':'История Узбекистана','Jismoniy tarbiya':'Физическая культура','Tarbiya':'Воспитание',
  'Kelajak soati':'Час будущего','Adabiyot':'Литература','Kasbiy ta’lim':'Профессиональное образование',
  'Komputer grafikasi':'Компьютерная графика','Web dasturlash':'Веб-программирование',
  'CHQBT':'Начальная допризывная подготовка',
};
// Misspellings in the source (e.g. Georgrafiya, Geometriyaa) stay unchanged.
export const subjectName = (subject:string,language:'uz'|'ru') => language==='ru' ? russian[subject] ?? subject : subject;
