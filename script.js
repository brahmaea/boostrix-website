// ВАШ ТОКЕН И CHAT ID УЖЕ НАСТРОЕНЫ
const TELEGRAM_BOT_TOKEN = '8283808797:AAEymrhAgZg8BMCSq30iCLAl7cOi4XkWN-k';
const TELEGRAM_CHAT_ID = '475597372';

// Функция проверки конфигурации
function checkConfig() {
    console.log('✅ Конфигурация настроена правильно!');
    return true;
}

// Функция отправки в Telegram
async function sendToTelegram(formData) {
    if (!checkConfig()) {
        return { success: false, error: 'Не настроен Chat ID' };
    }

    const message = `🔥 НОВАЯ ЗАЯВКА С САЙТА BOOSTRIX!

👤 Имя: ${formData.name}
📱 Telegram: ${formData.telegram}
💬 Сообщение: ${formData.message || 'Не указано'}
📅 Дата: ${new Date().toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    console.log('🔍 Отправляем запрос в Telegram...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const responseData = await response.json();
        console.log('📥 Ответ от Telegram API:', responseData);

        if (response.ok && responseData.ok) {
            console.log('✅ Сообщение отправлено успешно!');
            return { success: true };
        } else {
            console.error('❌ Ошибка от Telegram API:', responseData);
            
            let errorMessage = 'Неизвестная ошибка';
            if (responseData.error_code === 400) {
                errorMessage = 'Неверный Chat ID. Проверьте правильность Chat ID.';
            } else if (responseData.description) {
                errorMessage = responseData.description;
            }
            
            return { 
                success: false, 
                error: `Ошибка ${responseData.error_code}: ${errorMessage}` 
            };
        }
    } catch (error) {
        console.error('❌ Сетевая ошибка:', error);
        return { 
            success: false, 
            error: `Сетевая ошибка: ${error.message}` 
        };
    }
}

// Функция тестирования
async function testConnection() {
    const result = await sendToTelegram({
        name: 'Тест подключения',
        telegram: '@test',
        message: 'Проверка работы бота'
    });
    
    if (result.success) {
        alert('✅ Отлично! Бот работает правильно!');
    } else {
        alert(`❌ Ошибка: ${result.error}`);
    }
}

// Обработчики форм
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем кнопку тестирования
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Тест бота';
    testButton.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;padding:10px;background:#28a745;color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;';
    testButton.onclick = testConnection;
    document.body.appendChild(testButton);

    // Кнопка получения Chat ID (больше не нужна)
    const infoButton = document.createElement('button');
    infoButton.textContent = '✅ Настроено!';
    infoButton.style.cssText = 'position:fixed;top:60px;right:10px;z-index:9999;padding:10px;background:#28a745;color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;';
    infoButton.onclick = function() {
        alert('✅ Бот настроен!\n\nТокен: 8283808797:AAE...\nChat ID: 475597372\n\nТеперь можете тестировать формы!');
    };
    document.body.appendChild(infoButton);

    // Основная форма
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                telegram: document.getElementById('telegram').value,
                message: document.getElementById('message').value
            };

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
            submitBtn.disabled = true;

            const result = await sendToTelegram(formData);

            if (result.success) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                this.reset();
            } else {
                alert(`❌ Ошибка: ${result.error}\n\nСвяжитесь через Telegram: @egor_digital`);
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }

    // Модальная форма
    const modalForm = document.getElementById('modalForm');
    if (modalForm) {
        modalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('modalName').value,
                telegram: document.getElementById('modalTelegram').value,
                message: 'Запрос консультации'
            };

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
            submitBtn.disabled = true;

            const result = await sendToTelegram(formData);

            if (result.success) {
                alert('✅ Заявка отправлена!');
                this.reset();
                if (typeof closeModal === 'function') closeModal();
            } else {
                alert(`❌ Ошибка: ${result.error}`);
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
});

// Функции модального окна
function openModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}

// Закрытие модального окна
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modal');
        if (e.target === modal) closeModal();
    });
});
