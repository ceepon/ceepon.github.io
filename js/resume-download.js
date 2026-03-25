// js/resume-download.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('leadForm');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const downloadText = btn.querySelector('.download-text');
    const loadingText = btn.querySelector('.loading-text');

    // Show loading state
    toggleLoading(btn, true);

    try {
      const formData = new FormData(this);

      // Submit to Formspree
      const formResponse = await fetch('https://formspree.io/f/xpqoakga', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (formResponse.ok) {
        // Trigger PDF download
        triggerDownload('assets/docs/resume-sample.pdf', 'Ceepon_Pradhan_CV.pdf');
        showSuccessMessage();
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Download error:', error);
      showErrorMessage();
    } finally {
      toggleLoading(btn, false);
    }
  });

  function toggleLoading(btn, isLoading) {
    const downloadText = btn.querySelector('.download-text');
    const loadingText = btn.querySelector('.loading-text');

    if (isLoading) {
      downloadText.style.display = 'none';
      loadingText.style.display = 'inline';
      btn.disabled = true;
    } else {
      downloadText.style.display = 'inline';
      loadingText.style.display = 'none';
      btn.disabled = false;
    }
  }

  function triggerDownload(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function showSuccessMessage() {
    // Optional: Show success toast
    console.log('Resume downloaded successfully!');
  }

  function showErrorMessage() {
    alert('Something went wrong. Please refresh and try again.');
  }
});
