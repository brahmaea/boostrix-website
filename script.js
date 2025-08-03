// Настройки Telegram бота
const TELEGRAM_BOT_TOKEN = '8283808797:AAEymrhAgZg8BMCSq30iCLAl7cOi4XkWN-k';
const TELEGRAM_CHAT_ID = '475597372';

// Функция отправки в Telegram
async function sendToTelegram(formData) {
    const message = `🔥 НОВАЯ ЗАЯВКА С САЙТА BOOSTRIX!

👤 Имя: ${formData.name}
📱 Telegram: ${formData.telegram}
💬 Сообщение: ${formData.message || 'Не указано'}
📅 Дата: ${new Date().toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

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

        if (response.ok && responseData.ok) {
            return { success: true };
        } else {
            return { 
                success: false, 
                error: `Ошибка ${responseData.error_code}: ${responseData.description}` 
            };
        }
    } catch (error) {
        return { 
            success: false, 
            error: `Сетевая ошибка: ${error.message}` 
        };
    }
}

// Обработчики форм
document.addEventListener('DOMContentLoaded', function() {
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
                alert(`❌ Ошибка отправки. Попробуйте связаться через Telegram: @egor_digital`);
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
                message: 'Запрос консультации через модальное окно'
            };

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
            submitBtn.disabled = true;

            const result = await sendToTelegram(formData);

            if (result.success) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                this.reset();
                if (typeof closeModal === 'function') closeModal();
            } else {
                alert(`❌ Ошибка отправки. Попробуйте связаться через Telegram: @egor_digital`);
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
});

// Функции для модального окна
function openModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}

// Обработчики для закрытия модального окна
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    });
});
