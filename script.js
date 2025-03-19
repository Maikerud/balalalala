import { chatData } from './isichat.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log("Data dari isichat.js:", chatData);
    const text = chatData;
    const lines = text.split("\n"); // Memisahkan per baris
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = ""; // Kosongkan chat box sebelum menampilkan pesan

    const chatRegex = /^(\d{1,2}\/\d{1,2}\/\d{2}) (\d{2}.\d{2}) - (.*?): (.*)$/;
    let lastDate = '';

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const chatDataArray = lines.map(line => {
        const match = line.match(chatRegex);
        if (match) {
            const [_, date, time, sender, message] = match;
            const [day, month, year] = date.split('/');
            return {
                date: `${day} ${monthNames[parseInt(month) - 1]} 20${year}`,
                time,
                sender,
                message
            };
        }
        return null;
    }).filter(chat => chat !== null);

    function renderChatBatch(startIndex = 0, endIndex = chatDataArray.length) {
        chatBox.innerHTML = ''; // Clear chatBox before rendering new batch
        let lastDate = '';

        for (let i = startIndex; i < endIndex; i++) {
            const { date, time, sender, message } = chatDataArray[i];
            if (date !== lastDate) {
                const dateSeparator = document.createElement("div");
                dateSeparator.classList.add("date-separator");
                dateSeparator.textContent = date;
                chatBox.appendChild(dateSeparator);
                lastDate = date;
            }

            const chatBubble = document.createElement("div");
            chatBubble.classList.add("message", sender.startsWith("+62") ? "receiver" : "sender");
            chatBubble.innerHTML = `<strong>${sender}</strong><br>${message}<br><small>${time}</small>`;
            chatBox.appendChild(chatBubble);
        }
    }

    renderChatBatch(); // Render all chat messages initially

    // Toggle search input visibility
    window.toggleSearchInput = function() {
        searchInput.classList.toggle('visible');
        searchInput.focus();
    };

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const foundIndex = chatDataArray.findIndex(chat => chat.message.toLowerCase().includes(searchTerm));
        if (foundIndex !== -1) {
            renderChatBatch(foundIndex, foundIndex + 20); // Render 20 messages around the found message
        }
    });

    // Tambahkan event listener untuk scroll
    let lastScrollTop = 0;
    chatBox.addEventListener('scroll', function() {
        const dateHeaders = document.querySelectorAll('.date-separator');
        let currentDate = '';

        dateHeaders.forEach(header => {
            const rect = header.getBoundingClientRect();
            if (rect.top <= 0) {
                currentDate = header.textContent;
            }
        });

        const dateHeader = document.getElementById('dateHeader');
        if (currentDate) {
            dateHeader.textContent = currentDate;
            dateHeader.classList.add('show');
        } else {
            dateHeader.classList.remove('show');
        }

        // Tampilkan/sembunyikan header berdasarkan arah scroll
        let scrollTop = chatBox.scrollTop;
        if (scrollTop > lastScrollTop) {
            dateHeader.classList.remove('show');
        } else {
            dateHeader.classList.add('show');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});