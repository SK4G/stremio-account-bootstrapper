<template>
  <section id="faq">
    <h2>FAQ</h2>
    <details>
      <summary>What risks are involved?</summary>
      <p>
        You will wipe the existing setup and there's no current way to restore
        the previous configuration. It is recommended to use this on a fresh
        account or one where you want to start with a completely new setup.
      </p>
    </details>
    <details>
      <summary>Are my credentials safe?</summary>
      <p>
        Yes. We only use your credentials to authenticate with the Stremio API.
        We do not store them in any way; as soon as you refresh the page they
        are gone.
      </p>
      <p>
        If you're still in doubt, we highly encourage you to go read the source
        code. You'll see there's no hidden funny business going on.
      </p>
    </details>
    <details>
      <summary>What is the developer console and how do I open it?</summary>
      <p>
        The browser developer console is a tool which logs the information
        associated with a web application, such as network requests and errors.
        It also allows you to interact with the loaded web page using
        JavaScript. Most modern browsers have a developer console built in.
      </p>
      <p>
        Use
        <a
          href="https://balsamiq.com/support/faqs/browserconsole/"
          target="_blank"
          >this guide</a
        >
        to open your browsers developer console, ensuring have the Stremio web
        app open.
      </p>
    </details>
    <details>
      <summary>What should I do next?</summary>
      <p>
        You can now start enjoying your favorite movies and TV shows! The preset
        provides a solid foundation that should meet most people's needs.
        However, if you wish, you could update the configuration provided by the
        preset by accessing their respective settings in Stremio and/or add
        additional addons. All the available addons can be found
        <a href="https://stremio-addons.netlify.app" target="_blank">here</a>.
      </p>
    </details>
  </section>
</template>
