(() => {
	const updateTopbarHeight = () => {
		const topbar = document.getElementById('topbar');

		if (!topbar) {
			return;
		}

		document.documentElement.style.setProperty('--topbar-height', `${topbar.offsetHeight}px`);
	};

	window.redirectToContact = (interestedIn = null) => {
		if (interestedIn) {
			sessionStorage.setItem('interested_in', interestedIn);
		}
		window.location.href = 'contact';
	};

	const initializeContactForm = () => {
		const form = document.getElementById('contact-form');

		if (!form) {
			return;
		}

		const status = document.getElementById('contact-form-status');
		const submitButton = document.getElementById('contact-submit');

		const setStatus = (message, isError = false) => {
			if (!status) {
				return;
			}

			status.textContent = message;
			status.style.color = isError ? '#8b0000' : '#003366';
		};

		form.addEventListener('submit', async (event) => {
			console.log('geia');
			event.preventDefault();

			const email = String(form.elements.email?.value || '').trim();
			const mobile = String(form.elements.mobile?.value || '').trim();
			const message = String(form.elements.message?.value || '').trim();

			if (!email || !mobile || !message) {
				setStatus('Συμπληρώστε όλα τα πεδία.', true);
				return;
			}

			if (!form.reportValidity()) {
				setStatus('Ελέγξτε τη φόρμα και δοκιμάστε ξανά.', true);
				return;
			}

			if (submitButton) {
				submitButton.disabled = true;
			}

			setStatus('Αποστολή...');

			try {
				const formData = new FormData(form);
				const interestedIn = sessionStorage.getItem('interested_in');

				if (interestedIn) {
					formData.set('interested_in', interestedIn);
				}

				const response = await fetch(form.action, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					body: formData
				});

				const result = await response.json();

				if (!response.ok || !result.success) {
					throw new Error(result.message || 'Η αποστολή απέτυχε.');
				}

				setStatus('Το μήνυμα στάλθηκε επιτυχώς.');
				form.reset();
			} catch (error) {
				setStatus(error.message || 'Προέκυψε σφάλμα κατά την αποστολή.', true);
			} finally {
				if (submitButton) {
					submitButton.disabled = false;
				}
			}
		});
	};

	const initialize = () => {
		updateTopbarHeight();
		initializeContactForm();
		window.addEventListener('resize', updateTopbarHeight);
		window.addEventListener('load', updateTopbarHeight, { once: true });
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize, { once: true });
	} else {
		initialize();
	}
})();
