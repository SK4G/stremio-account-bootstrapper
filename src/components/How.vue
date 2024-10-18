<template>
  <section id="how">
    <h2>How to get the Stremio AuthKey?</h2>
    <ol>
      <li>
        Login to
        <a href="https://web.stremio.com" target="_blank"
          >https://web.stremio.com</a
        >
        using your Stremio credentials in your browser.
      </li>
      <li>
        Open the developer console <a href="#faq">(?)</a> and paste the follow
        code snippet:
        <div class="code-container">
          <code>JSON.parse(localStorage.getItem("profile")).auth.key</code>
        </div>
      </li>
      <li>Take the output value and paste it into the form above.</li>
    </ol>
  </section>
</template>

<style scoped>
.code-container {
  overflow-x: auto;
  padding: 10px;
  border-radius: 4px;
}

code {
  white-space: nowrap;
  font-family: monospace;
  font-size: 0.9em;
  color: #b93334;
}

@media (max-width: 600px) {
  .code-container {
    padding: 5px;
  }
  code {
    font-size: 0.8em;
  }
}
</style>
