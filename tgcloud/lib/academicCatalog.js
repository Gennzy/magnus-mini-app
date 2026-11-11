export const ACADEMIC_CATALOG_VERSION = 1;

export const ACADEMIC_CATALOG = {
  faculties: [
    { id: 'it', title: 'Факультет технологий', description: 'Цифровые продукты, данные и искусственный интеллект.', programs: ['ai'] },
    { id: 'psychology', title: 'Факультет психологии', description: 'Мышление, поведение и взаимодействие человека.', programs: ['mind'] },
    { id: 'marketing', title: 'Факультет маркетинга', description: 'Бренды, аудитория и стратегические коммуникации.', programs: ['brand'] },
  ],
  programs: {
    ai: {
      id: 'ai', code: 'MAG-IT-001', facultyId: 'it', title: 'Введение в искусственный интеллект',
      level: 'Базовая программа', duration: '6 учебных тем', format: 'Самостоятельное обучение с проверкой практики',
      description: 'Понять принципы ИИ, научиться оценивать результаты моделей и применять инструменты осознанно.',
      outcomes: ['Различать основные подходы искусственного интеллекта', 'Понимать роль данных и машинного обучения', 'Проверять ответы и ограничения генеративных моделей'],
      terms: [
        { id: 'ai-term-1', title: 'Первый учебный блок', order: 1, subjects: [
          { id: 'ai-subject-1', title: 'Основы искусственного интеллекта', required: true, lessonIds: ['ai-01','ai-02','ai-03'] },
        ] },
        { id: 'ai-term-2', title: 'Второй учебный блок', order: 2, subjects: [
          { id: 'ai-subject-2', title: 'Генеративные модели и применение', required: true, lessonIds: ['ai-04','ai-05','ai-06'] },
        ] },
      ],
    },
    mind: {
      id: 'mind', code: 'MAG-PSY-001', facultyId: 'psychology', title: 'Психология мышления',
      level: 'Базовая программа', duration: '6 учебных тем', format: 'Самостоятельное обучение с проверкой практики',
      description: 'Изучить когнитивные процессы, принятие решений и влияние привычек на поведение.',
      outcomes: ['Описывать базовые когнитивные процессы', 'Замечать типичные ошибки мышления', 'Применять инструменты осознанного принятия решений'],
      terms: [
        { id: 'mind-term-1', title: 'Первый учебный блок', order: 1, subjects: [
          { id: 'mind-subject-1', title: 'Основы психологии и познания', required: true, lessonIds: ['mind-01','mind-02','mind-03'] },
        ] },
        { id: 'mind-term-2', title: 'Второй учебный блок', order: 2, subjects: [
          { id: 'mind-subject-2', title: 'Мышление и поведение', required: true, lessonIds: ['mind-04','mind-05','mind-06'] },
        ] },
      ],
    },
    brand: {
      id: 'brand', code: 'MAG-MKT-001', facultyId: 'marketing', title: 'Основы бренд-стратегии',
      level: 'Базовая программа', duration: '6 учебных тем', format: 'Самостоятельное обучение с проверкой практики',
      description: 'Разобраться в позиционировании, ценности бренда и последовательной коммуникации с аудиторией.',
      outcomes: ['Определять целевую аудиторию', 'Формулировать позиционирование и ценность', 'Связывать коммуникации с задачами бренда'],
      terms: [
        { id: 'brand-term-1', title: 'Первый учебный блок', order: 1, subjects: [
          { id: 'brand-subject-1', title: 'Стратегическая основа бренда', required: true, lessonIds: ['brand-01','brand-02','brand-03'] },
        ] },
        { id: 'brand-term-2', title: 'Второй учебный блок', order: 2, subjects: [
          { id: 'brand-subject-2', title: 'Позиционирование и коммуникации', required: true, lessonIds: ['brand-04','brand-05','brand-06'] },
        ] },
      ],
    },
  },
};

export function getProgramLessonIds(programId) {
  const program = ACADEMIC_CATALOG.programs[programId];
  if (!program) return [];
  return program.terms.flatMap(term => term.subjects.flatMap(subject => subject.lessonIds));
}

export function getPublicAcademicCatalog() {
  return {
    version: ACADEMIC_CATALOG_VERSION,
    faculties: ACADEMIC_CATALOG.faculties,
    programs: Object.values(ACADEMIC_CATALOG.programs),
  };
}
