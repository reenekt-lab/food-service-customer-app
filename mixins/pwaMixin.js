export default {
  data () {
    return {
      pwaInfo: {
        installed: false,
        canBeInstalled: false
      }
    }
  },
  beforeMount () {
    window.addEventListener('pwa-prompt-caught', (event) => {
      this.pwaInfo.canBeInstalled = this.$pwaInstaller.canBeInstalled
      // this.$root.pwaCanBeInstalled = this.$pwaInstaller.canBeInstalled
      window.pwaInfo = {
        installed: this.pwaInfo.installed,
        canBeInstalled: this.pwaInfo.canBeInstalled
      }
    })
    window.addEventListener('appinstalled', (event) => {
      this.pwaInfo.installed = true
      // this.$root.pwaCanBeInstalled = this.$pwaInstaller.canBeInstalled
      if (!window.pwaInfo) {
        window.pwaInfo = {
          installed: this.pwaInfo.installed,
          canBeInstalled: this.pwaInfo.canBeInstalled
        }
      }
    })
  },
  mounted () {
    // sync local (on page) data with global (stored in window) data
    if (window.pwaInfo) {
      this.pwaInfo.installed = window.pwaInfo.installed
      this.pwaInfo.canBeInstalled = window.pwaInfo.canBeInstalled
    }
  }
}
