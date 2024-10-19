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
      <summary>What is a debrid service?</summary>
      <p>
        A debrid service is an unrestricted multi-hoster that allows you to
        stream and download videos instantly at the best speeds. In plain
        English, the debrid service acts as a middleman between the BitTorrent
        tracker and you, so you download the content directly from their servers
        at high speed. Most of the content is already cached, meaning you can
        instantly access it.
      </p>
      <p>Main benefits:</p>
      <ul>
        <li>
          High-speed downloads, no buffering. Yes, including 4K content (your
          experience might vary based on your internet connection).
        </li>
        <li>
          If you live in a country where internet providers monitor torrent
          activity, you are safe with one and there is no need for a VPN to
          stream.
        </li>
        <li>
          Content may still be accessible even if the original source is no
          longer available.
        </li>
        <li>
          A small cost gets you a Netflix-like experience for as little as US$3
          per month.
        </li>
      </ul>
      <p>
        <i
          >If you live in a country where torrenting is allowed or have a VPN
          and are okay with some buffering here and there, you can skip it.</i
        >
      </p>
    </details>
    <details>
      <summary>What should I do next?</summary>
      <p>
        You can now start enjoying your favorite movies and TV shows! The preset
        provides a solid foundation that should meet most people's needs.
        However, if you wish, you could update the addons configuration provided
        by the preset by accessing their respective settings in Stremio and/or
        add additional addons. All the available addons can be found
        <a href="https://stremio-addons.netlify.app" target="_blank">here</a>.
      </p>
    </details>
  </section>
</template>
