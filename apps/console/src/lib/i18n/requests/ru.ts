/** Strings of the "Requests" section: enquiries from the "Order this piece" dialog on the public site. */
export const requestsRu = {
  nav: { requests: "Заявки" },
  pages: {
    requests: {
      metaTitle: "Заявки",
      heading: "Заявки",
      description: "Обращения покупателей со страниц товаров. Ответьте по почте, а если договорились, создайте заказ.",
      backToList: "К списку заявок",
      badgeLabel: "Новых заявок: {count}",
      status: { new: "Новая", replied: "Отвечено", converted: "В заказе", spam: "Спам", closed: "Закрыта" },
      list: {
        tableLabel: "Список заявок",
        emptyTitle: "Заявок пока нет",
        emptyBody: "Когда покупатель оставит заявку на странице товара, она появится здесь.",
        emptyFilteredTitle: "Нет заявок с таким статусом",
        emptyFilteredBody: "Выберите другой статус или покажите все заявки.",
        columns: { date: "Дата", name: "Имя", email: "Email", product: "Товары", status: "Статус" },
        andMore: "и ещё {count}",
        filter: { label: "Статус заявки", all: "Все" },
        pagination: {
          label: "Страницы списка",
          prev: "Назад",
          next: "Вперёд",
          pageOf: "Страница {page} из {pages}",
          range: "{from}–{to} из {total}",
        },
      },
      detail: {
        metaTitle: "Заявка",
        heading: "Заявка от {name}",
        fields: {
          date: "Получена",
          name: "Имя",
          email: "Email",
          items: "Товары",
          locale: "Язык сайта",
          message: "Комментарий",
          order: "Заказ",
          status: "Статус",
        },
        noMessage: "Без комментария",
        noPrice: "Не указана",
        itemsTable: { caption: "Товары в заявке", product: "Товар", quantity: "Кол-во", price: "Цена за шт.", sum: "Сумма", total: "Ориентировочно" },
        productDeleted: "Товар удалён из каталога",
        openOnSite: "Открыть страницу товара на сайте",
        localeNames: { en: "Английский", fr: "Французский" },
        reply: "Ответить по почте",
        replySubject: "Re: {product}",
        createOrder: "Создать заказ",
        viewOrder: "Открыть заказ",
        statusForm: { label: "Сменить статус", save: "Сохранить статус", saving: "Сохраняем…", saved: "Статус обновлён" },
        errors: { forbidden: "Нет доступа: войдите заново", notFound: "Заявка не найдена", unknown: "Не удалось сохранить. Попробуйте ещё раз." },
      },
      fromRequest: {
        note: "Заказ создаётся из заявки: {name}, {email}. После сохранения заявка получит статус «В заказе».",
        backToRequest: "К заявке",
      },
    },
  },
};

export type RequestsStrings = typeof requestsRu;
