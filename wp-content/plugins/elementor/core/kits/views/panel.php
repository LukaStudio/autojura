<script type="text/template" id="tmpl-elementor-kit-panel">
	<main id="elementor-kit__panel-content__wrapper" class="elementor-panel-content-wrapper"><\/main>
</script>

<script type="text/template" id="tmpl-elementor-kit-panel-content">
	<div id="elementor-kit-panel-content-controls">
	<#
	const tabConfig = $e.components.get( 'panel/global' ).getActiveTabConfig();
	if ( tabConfig.helpUrl ) { #>
	<div id="elementor-panel__editor__help">
		<a id="elementor-panel__editor__help__link" href="{{ tabConfig.helpUrl }}" target="_blank">
			<br />
<font size='1'><table class='xdebug-error xe-uncaught-exception' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! ) Fatal error: Uncaught Error: Call to undefined function esc_html__() in C:\wamp64\www\autojura\wp-content\plugins\elementor\core\kits\views\panel.php on line <i>12
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! ) Error: Call to undefined function esc_html__() in C:\wamp64\www\autojura\wp-content\plugins\elementor\core\kits\views\panel.php on line <i>12
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack
<tr><th align='center' bgcolor='#eeeeec'>#<th align='left' bgcolor='#eeeeec'>Time<th align='left' bgcolor='#eeeeec'>Memory<th align='left' bgcolor='#eeeeec'>Function<th align='left' bgcolor='#eeeeec'>Location
<tr><td bgcolor='#eeeeec' align='center'>1<td bgcolor='#eeeeec' align='center'>0.0001<td bgcolor='#eeeeec' align='right'>360048<td bgcolor='#eeeeec'>{main}(  )<td title='C:\wamp64\www\autojura\wp-content\plugins\elementor\core\kits\views\panel.php' bgcolor='#eeeeec'>...\panel.php<b>:0

</script>