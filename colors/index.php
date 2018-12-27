<?php

include('header.php');
?>

<div class="container">
	<div id="output">
	</div>
</div>
<div class="showColor" style="display: none;">
	<div class="tip_group">
		<div class="showText" style="background:#aabbcc" onclick='closeTip()'>
			<div class="close">X</div>
		</div>
		<div class="tool">
			<span class="tip">#aabbcc</span>
			Copied!
		</div>
	</div>
</div>

<script src="https://unpkg.com/clipboard@2.0.0/dist/clipboard.min.js"></script>
<script src="../scripts/main.js"></script>
<?php
include('../footer.php');
?>
